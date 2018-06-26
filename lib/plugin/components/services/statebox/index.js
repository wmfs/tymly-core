'use strict'

const Statebox = require('@wmfs/statebox')
const _ = require('lodash')

const ENABLED_RBAC = true

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
      const machines = Object.entries(options.blueprintComponents.stateMachines)

      const createMachine = (index) => {
        if (index === machines.length) {
          return callback(null)
        }

        const [name, definition] = machines[index]
        const meta = {
          name: name,
          namespace: definition.namespace,
          schemaName: _.snakeCase(definition.namespace),
          comment: definition.comment,
          version: definition.version
        }

        this.statebox.createStateMachine(
          name,
          definition,
          meta,
          options,
          () => createMachine(index + 1)
        )
      } // createMachine

      createMachine(0)
    } else {
      callback(null)
    }
  }

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

  async startExecution (input, stateMachineName, executionOptions, callback) {
    if (callback) {
      return this.startExecution(input, stateMachineName, executionOptions)
        .then(executionDescription => callback(null, executionDescription))
        .catch(err => callback(err))
    } // if ...

    const [authOk, errExecDesc] = await this.authorisationCheck(
      executionOptions.userId,
      stateMachineName,
      executionOptions,
      'create'
    )
    return authOk
      ? this.statebox.startExecution(input, stateMachineName, executionOptions)
      : errExecDesc
  } // startExecution

  async stopExecution (cause, error, executionName, executionOptions, callback) {
    if (callback) {
      return this.stopExecution(cause, error, executionName, executionOptions)
        .then(executionDescription => callback(null, executionDescription))
        .catch(err => callback(err))
    }

    const executionDescription = await this.statebox.describeExecution(executionName)
    const [authOk, errExecDesc] = await this.authorisationCheck(
      executionOptions.userId,
      executionDescription.stateMachineName,
      executionDescription.executionOptions,
      'stop'
    )
    return authOk
      ? this.statebox.stopExecution(cause, error, executionName, executionOptions)
      : errExecDesc
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

  waitUntilStoppedRunning (executionName, callback) {
    const p = this.statebox.waitUntilStoppedRunning(executionName)

    return promiseOrCallback(p, callback)
  } // waitUntilStoppedRunning

  //////////////////////////////////////
  updateIfAuthorised (executionName, output, executionOptions, updateFn) {
    return this.proceedIfAuthorised(
      executionName,
      executionOptions,
      'update',
      () => updateFn.call(this.statebox, executionName, output)
    )
  } // updateIfAuthorised

  async proceedIfAuthorised (executionName, executionOptions, action, actionFn) {
    const executionDescription = await this.statebox.describeExecution(executionName, executionOptions)
    const [authOk, errExecDesc] = await this.authorisationCheck(
      executionOptions.userId,
      executionDescription.stateMachineName,
      executionDescription.executionOptions,
      action
    )

    return (authOk)
      ? actionFn()
      : errExecDesc
  } // processIfAuthorised

  authorisationCheck (stateMachineName, executionOptions, action) {
    if (!ENABLED_RBAC) {
      return [true] // STUB!
    }

    return this.doAuthorisationCheck(stateMachineName, executionOptions, action)
  } // authorisationCheck

  async doAuthorisationCheck (userId, stateMachineName, executionOptions, action) {
    const rbac = this.services.rbac

    const roles = await rbac.getUserRoles(userId)
    const authorised = rbac.checkRoleAuthorization(
      userId,
      executionOptions,
      roles,
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
  } // authorisationCheck
} // class StateboxService

function addResources (statebox, options) {
  options.messages.info('Adding resources...')
  const stateResources = options.pluginComponents.stateResources
  if (!_.isObject(stateResources)) {
    return
  }

  const resourceClasses = {}
  for (const [name, resource] of Object.entries(stateResources)) {
    resourceClasses[name] = resource.componentModule
  } // for ...

  statebox.createModuleResources(resourceClasses)
} // _addResources

module.exports = {
  bootAfter: ['storage', 'temp', 'categories', 'registry'],
  refProperties: {
    stateMachineName: 'stateMachines'
  },
  serviceClass: StateboxService
}
