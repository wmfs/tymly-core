class SubscriptionService {
  boot (options) {
    this.adminUserId = process.env.TYMLY_ADMIN_USERID
    this.stateMachineSubs = {}
    this.statebox = options.bootedServices.statebox
    this.execution = options.bootedServices.storage.models.tymly_execution
  }

  async startExecution (inputs, name) {
    const opts = { userId: this.adminUserId }
    const execDesc = await this.statebox.startExecution(inputs, name, opts)
    return execDesc.executionName
  }

  stopExecution (executionName, stateMachineName) {
    return this.statebox.stopExecution(
      'Execution stopped',
      'STOPPED',
      executionName,
      {
        userId: this.adminUserId,
        action: 'stopExecution',
        stateMachineName
      }
    )
  }

  async subscribe (subs) {
    if (!subs) return

    subs = Array.isArray(subs) ? subs : [subs]

    for (const sub of subs) {
      if (sub.type === 'stateMachine') {
        if (!this.stateMachineSubs[sub.name]) this.stateMachineSubs[sub.name] = { count: 0, executionName: null }

        this.stateMachineSubs[sub.name].count++

        if (this.stateMachineSubs[sub.name].executionName === null) {
          const inputs = {}
          this.stateMachineSubs[sub.name].executionName = await this.startExecution(inputs, sub.name)
        }
      }
    }
  }

  async unsubscribe (subs) {
    if (!subs) return

    subs = Array.isArray(subs) ? subs : [subs]

    for (const sub of subs) {
      if (sub.type === 'stateMachine') {
        if (!this.stateMachineSubs[sub.name]) continue

        this.stateMachineSubs[sub.name].count--

        if (this.stateMachineSubs[sub.name].count === 0) {
          await this.stopExecution(this.stateMachineSubs[sub.name].executionName, sub.name)
          this.stateMachineSubs[sub.name].executionName = null
        }
      }
    }
  }
}

module.exports = {
  serviceClass: SubscriptionService,
  bootAfter: ['statebox']
}
