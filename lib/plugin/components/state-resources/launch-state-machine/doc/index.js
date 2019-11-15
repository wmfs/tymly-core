'use strict'

module.exports = {
  description: 'Launches another state machine, but does not wait for it to complete. The output of this state-resource is the execution description of the launched state machine. The description of the parent state machine is given as input to the launched state machine so it can, for example, send heart beats back.',
  example: require('./example.json')
}
