const Metadata = require('../metadata')
const Markdown = require('../markdown')
const showdown = require('showdown')

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

  get markdown () {
    if (this._markdown) return this._markdown
    this._markdown = (new Markdown(this._sourcePath)).load()
    return this._markdown
  }

  get metadata () {
    return this.markdown.metadata
  }

  get content () {
    return this.markdown.content
  }

  get htmlContent () {
    return this.converter.makeHtml(this.content)
  }

  get converter () {
    if (this._converter) return this._converter
    this._converter = new showdown.Converter()
    return this._converter
  }

  get compiledMetadata () {
    if (this._compiledMetadata) return this._compiledMetadata
    this._compiledMetadata = (new Metadata(this.metadata)).build().metadata
    return this._compiledMetadata
  }
}

module.exports = HtmlDocument
