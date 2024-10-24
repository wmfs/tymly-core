class Justfail {
  run (event, context) {
    context.sendTaskFailure({
      error: 'justFail',
      cause: new Error('Just Fail')
    })
  } // run
} // Justfail

module.exports = Justfail
