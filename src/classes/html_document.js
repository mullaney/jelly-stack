const fs = require('fs')
const Metadata = require('../metadata')
const Markdown = require('../markdown')
const showdown = require('showdown')
const templates = require('../util/templates')
const { renderStyleLinks } = require('../util/cssService')
const { newFilename } = require('../util/fileServices')
const { replaceImageSrcInFile, imageMap } = require('../util/imageService')

class HtmlDocument {
  constructor (options = {}) {
    this._sourcePath = options.sourcePath || ''
    this._siteConfig = options.siteConfig || {}
  }

  get html () {
    if (this._html) return this._html
    const mainHtml = this.template({ content: this.htmlContent, ...this.metadata })
    const options = {
      header: templates.header({ menu: this.menu }),
      title: this.metadata.title || this._siteConfig.site_name,
      main: mainHtml,
      styleLinks: renderStyleLinks(),
      metadata: this.compiledMetadata
    }

    this._html = templates.application(options)
    return this._html
  }

  get menu () {
    return this._siteConfig.menu || []
  }

  get htmlWithImages () {
    if (this._htmlWithImages) return this._htmlWithImages
    this._htmlWithImages = replaceImageSrcInFile(this.html, imageMap)
    return this._htmlWithImages
  }

  save () {
    let dir = 'dist/'
    if (this.templateName === 'posts') dir += 'posts/'
    fs.writeFileSync(`${dir}/${newFilename(this._sourcePath)}`, this.htmlWithImages)
    return this
  }

  get template () {
    if (this._template) return this._template

    if (this.templateName && templates[this.templateName]) {
      this._template = templates[this.templateName]
    } else {
      this._template = templates.default
    }

    return this._template
  }

  get templateName () {
    if (this._templateName) return this._templateName
    const regex = /^(.*)\//
    this._templateName = this._sourcePath.match(regex)[1]
    return this._templateName
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
