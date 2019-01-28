const Statebox = require('@wmfs/statebox')
const stateLint = require('@wmfs/tymly-statelint')
const functionResolver = require('./resources/functions')
const _ = require('lodash')

const cls = require('cls-hooked')
const session = cls.createNamespace('statebox')

function promiseOrCallback (p, callback) {
  if (callback) {
    p
      .then(r => callback(null, r))
      .catch(err => callback(err))
  } else {
    return p
  }
} // promiseOrCallback

class StateboxService {
  async boot (options, callback) {
    this.services = options.bootedServices

    this.statebox = new Statebox(options)
    await this.statebox.ready

    addResources(this.statebox, options)

    options.messages.info('Adding state machines...')
    if (_.isObject(options.blueprintComponents.stateMachines)) {
      try {
        const logger = {
          warn: msg => options.messages.warning(msg),
          error: msg => options.messages.warning(msg)
        }
        const validator = stateLint(options.pluginComponents.stateResources, logger)
        for (const [name, definition] of Object.entries(options.blueprintComponents.stateMachines)) {
          options.messages.detail(`Validating ${name}`)
          const problems = validator.validate(definition)
          if (problems.length) {
            problems.unshift(`${name}:`)
            options.messages.warning(problems.join('\n\t'))
          }
        }

        for (const [name, definition] of Object.entries(options.blueprintComponents.stateMachines)) {
          const meta = {
            name: name,
            namespace: definition.namespace,
            schemaName: _.snakeCase(definition.namespace),
            comment: definition.comment,
            version: definition.version
          }

          options.messages.detail(`Adding ${name}`)
          await this.statebox.createStateMachine(
            name,
            definition,
            meta,
            options
          )
        } // for ...
      } catch (err) {
        return callback(err)
      }
    }

    callback(null)
  } // boot

  findStateMachineByName (name) {
    return this.statebox.findStateMachineByName(name)
  }

  findStates (options) {
    return this.statebox.findStates(options)
  }

  findStateMachines (options) {
    return this.statebox.findStateMachines(options)
  }

  listStateMachines () {
    return this.statebox.listStateMachines()
  }

  listStateResources () {
    return this.statebox.listModuleResources()
  }

  async startExecution (input, stateMachineName, executionOptions, callback) {
    if (callback) {
      return this.startExecution(input, stateMachineName, executionOptions)
        .then(executionDescription => callback(null, executionDescription))
        .catch(err => callback(err))
    } // if ...

    return this.processIfAuthorised(
      executionOptions.userId,
      stateMachineName,
      executionOptions,
      'create',
      () => this.statebox.startExecution(input, stateMachineName, executionOptions)
    )
  } // startExecution

  stopExecution (cause, error, executionName, executionOptions, callback) {
    if (callback) {
      return this.stopExecution(cause, error, executionName, executionOptions)
        .then(executionDescription => callback(null, executionDescription))
        .catch(err => callback(err))
    }

    return this.describeAndProcessIfAuthorised(
      executionName,
      executionOptions,
      'stop',
      () => this.statebox.stopExecution(cause, error, executionName, executionOptions)
    )
  } // stopExecution

  listExecutions (executionOptions, callback) {
    this.statebox.listExecutions(executionOptions, callback)
  }

  describeExecution (executionName, executionOptions, callback) {
    return promiseOrCallback(this.statebox.describeExecution(executionName), callback)
  } // describeExecution

  sendTaskSuccess (executionName, output, executionOptions, callback) {
    if (callback) {
      return promiseOrCallback(this.sendTaskSuccess(executionName, output, executionOptions), callback)
    }

    return this.updateIfAuthorised(
      executionName,
      output,
      executionOptions,
      this.statebox.sendTaskSuccess
    )
  } // sendTaskSuccess

  sendTaskHeartbeat (executionName, output, executionOptions, callback) {
    if (callback) {
      return promiseOrCallback(this.sendTaskHeartbeat(executionName, output, executionOptions), callback)
    }

    return this.updateIfAuthorised(
      executionName,
      output,
      executionOptions,
      this.statebox.sendTaskHeartbeat
    )
  } // sendTaskHeartbeat

  sendTaskFailure (executionName, output, executionOptions, callback) {
    if (callback) {
      return promiseOrCallback(this.sendTaskFailure(executionName, output, executionOptions), callback)
    }
    return this.updateIfAuthorised(
      executionName,
      output,
      executionOptions,
      this.statebox.sendTaskFailure
    )
  } // sendTaskFailure

  sendTaskRevivification (executionName, executionOptions, callback) {
    if (callback) {
      return promiseOrCallback(this.sendTaskRevivification(executionName, executionOptions), callback)
    }
    console.error(`sendTaskRevivification(${executionName})`)
    return this.reviveIfAuthorised(
      executionName,
      executionOptions,
      this.statebox.sendTaskRevivification
    )
  }

  waitUntilStoppedRunning (executionName, callback) {
    const p = this.statebox.waitUntilStoppedRunning(executionName)

    return promiseOrCallback(p, callback)
  } // waitUntilStoppedRunning

  /// ///////////////////////////////////
  updateIfAuthorised (executionName, output, executionOptions, updateFn) {
    return this.describeAndProcessIfAuthorised(
      executionName,
      executionOptions,
      'update',
      () => updateFn.call(this.statebox, executionName, output)
    )
  } // updateIfAuthorised

  reviveIfAuthorised (executionName, executionOptions, updateFn) {
    return this.describeAndProcessIfAuthorised(
      executionName,
      executionOptions,
      'revive',
      () => updateFn.call(this.statebox, executionName)
    )
  } // reviveIfAuthorised

  async describeAndProcessIfAuthorised (executionName, executionOptions, action, actionFn) {
    const executionDescription = await this.statebox.describeExecution(executionName, executionOptions)
    return this.processIfAuthorised(
      executionOptions.userId,
      executionDescription.stateMachineName,
      executionDescription.executionOptions,
      action,
      actionFn
    )
  } // describeAndProcessIfAuthorised

  async processIfAuthorised (userId, stateMachineName, executionOptions, action, actionFn) {
    const [authOk, errExecDesc] = await this.authorisationCheck(
      userId,
      stateMachineName,
      executionOptions,
      action
    )

    if (!authOk) return errExecDesc

    const userEmail = await this.lookupUserEmail(userId)

    let result = null
    session.run(() => {
      this.bindCurrentUser(session, userEmail)
      result = actionFn()
    })
    return result
  } // processIfAuthorised

  authorisationCheck (userId, stateMachineName, executionOptions, action) {
    if (!this.services.rbac) {
      return [true] // No RBAC service installed.  Just continue.
    }

    return this.doAuthorisationCheck(userId, stateMachineName, executionOptions, action)
  } // authorisationCheck

  async doAuthorisationCheck (userId, stateMachineName, executionOptions, action) {
    const rbac = this.services.rbac

    const authorised = await rbac.checkAuthorization(
      userId,
      executionOptions,
      'stateMachine',
      stateMachineName,
      action
    )

    if (authorised) {
      return [true]
    } // if good ...

    return [
      false,
      {
        status: 'NOAUTH',
        stateMachineName: stateMachineName,
        errorCode: '401',
        errorMessage: `'${(typeof userId === 'string') ? userId : null}' can not perform '${action}' on '${stateMachineName}'`
      }
    ]
  } // doAuthorisationCheck

  async lookupUserEmail (userId) {
    if (!userId) return userId
    if (!this.services.userInfo) return userId

    try {
      const email = await this.services.userInfo.emailFromUserId(userId)
      return email || userId
    } catch (e) {
      return userId
    }
  } // lookupUserEmail

  bindCurrentUser (session, userId) {
    if (this.services.storage.setCurrentUser) {
      session.set('userId', userId)
      this.services.storage.setCurrentUser(() => {
        return session.get('userId')
      })
    } // if ...
  } // bindCurrentUser
} // class StateboxService

function addResources (statebox, options) {
  options.messages.info('Adding resources...')
  const stateResources = options.pluginComponents.stateResources
  if (!_.isObject(stateResources)) {
    return
  }

  const resourceClasses = {}
  for (const [name, resource] of Object.entries(stateResources)) {
    options.messages.detail(`Adding ${name}`)
    resourceClasses[name] = resource.componentModule
  } // for ...

  statebox.createModuleResources(resourceClasses)

  statebox.registerResourceResolver('function', functionResolver)
} // _addResources

module.exports = {
  bootAfter: ['storage', 'temp', 'categories', 'registry'],
  refProperties: {
    stateMachineName: 'stateMachines'
  },
  serviceClass: StateboxService
}
