const _ = require('lodash')

class FunctionResource {
  constructor (functionName, stateMachineName) {
    this.functionName = functionName
    this.stateMachineName = stateMachineName
  }

  init (env) {
    this.env = env
    this.functions = env.bootedServices.functions
  } // init

  async run (event, context) {
    const namespace = context.stateMachineMeta.namespace
    const funcName = `${namespace}_${this.functionName}`
    const func = this.functions.functions[funcName]

    if (!func) {
      return context.sendTaskFailure({
        error: 'UNKNOWN_FUNCTION',
        cause: `Cannot find function: ${funcName} in state machine ${this.stateMachineName}`
      })
    }

    const [args, hasCallback] = FunctionResource.buildArguments(func.args, this.env, event, context)
    const result = await FunctionResource.execFunction(func, args, hasCallback)

    context.sendTaskSuccess(_.isString(result) ? { result } : result)
  } // run

  static execFunction (func, args, hasCallback) {
    if (hasCallback) {
      return new Promise((resolve, reject) => {
        func.func(...args, (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      })
    } else {
      return func.func(...args)
    }
  }

  static buildArguments (funcArgs, env, event, context) {
    const hasCallback = funcArgs.includes('callback')
    const args = funcArgs.map(arg => {
      if (arg !== 'callback') {
        if (arg === 'event') {
          return event
        } else if (arg === 'context') {
          return context
        } else if (arg === 'env') {
          return this.env
        } else {
          return event[arg]
        }
      }
    }).filter(arg => arg)

    return [args, hasCallback]
  }
} // class FunctionResource

function functionResolver (functionName, resourceConfig, stateMachineName) {
  return new FunctionResource(functionName, stateMachineName)
} // functionResolver

module.exports = functionResolver
