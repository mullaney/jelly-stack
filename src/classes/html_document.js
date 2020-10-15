class HtmlDocument {
  constructor (options = {}) {
    this._sourcePath = options.sourcePath || ''
    this._siteConfig = options.siteConfig || {}
    if (options.assets) {
      this._images = options.assets.images || []
      this._css = options.assets.css || []
      this._scripts = options.assets.scripts || []
    } else {
      this._images = []
      this._css = []
      this._scripts = []
    }
  }
}

module.exports = HtmlDocument
