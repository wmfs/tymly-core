class ReferenceProbe {
  boot (options) {
    this.files = options.blueprintComponents.files
  }
}

module.exports = {
  serviceClass: ReferenceProbe
}
