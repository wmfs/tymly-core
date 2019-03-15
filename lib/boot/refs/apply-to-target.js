const dottie = require('dottie')

function applyToTarget (targetObj, refObj, path) {
  const dottiePath = jp2dp(path)
  dottie.set(targetObj, dottiePath, refObj)
} // firstPassResolver

function jp2dp (targetPath) {
  return targetPath
    .replace('$.', '')
    .replace(/\[/g, '.')
    .replace(/\]/g, '')
} // jp2dp

module.exports = applyToTarget
