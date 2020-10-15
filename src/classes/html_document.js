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

  build () {
    this.convertMarkdown()
  }

  convertMarkdown () {
    const markdown = (new Markdown(this._sourcePath)).load()
    this._htmlContent = (new showdown.Converter()).makeHtml(markdown.html())
    return this
  }

  extractMetadata () {
    this._metadata = (new Metadata(this._markdown.metadata)).build().metadata()
    return this
  }
}

module.exports = HtmlDocument
