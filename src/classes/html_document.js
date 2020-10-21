const fs = require('fs')
const Metadata = require('../metadata')
const Markdown = require('../markdown')
const showdown = require('showdown')
const templates = require('../util/templates')
const { renderStyleLinks, renderJsTags } = require('../util/assetsService')
const { newFilename } = require('../util/fileServices')
const { replaceImageSrcInFile, imageMap } = require('../util/imageService')

class HtmlDocument {
  constructor (options = {}) {
    this._sourcePath = options.sourcePath || ''
    this._siteConfig = options.siteConfig || {}
    this._mainHtml = options.mainHtml
    this._url = options.url
    this._metadata = options.metadata
  }

  get html () {
    if (this._html) return this._html
    const options = {
      header: templates.header({ menu: this.menu }),
      title: this.metadata.title || this._siteConfig.site_name,
      main: this.mainHtml,
      styleLinks: renderStyleLinks(),
      jsTags: renderJsTags(),
      metadata: this.compiledMetadata
    }

    this._html = templates.application(options)
    return this._html
  }

  get mainHtml () {
    if (this._mainHtml) return this._mainHtml
    this._mainHtml = this.template({ content: this.htmlContent, ...this.metadata })
    return this._mainHtml
  }

  get dataPoints () {
    if (this._dataPoints) return this._dataPoints
    const stats = fs.statSync(this._sourcePath)
    this._dataPoints = {
      ...this.metadata,
      url: this.targetUrl,
      type: this.templateName,
      created_at: stats.birthtime,
      updated_at: stats.mtime,
      image_url: this.imageUrl,
      summary: this.summary,
      published_at: new Date(this.metadata.published || stats.birthtime).toLocaleDateString()
    }
    return this._dataPoints
  }

  get imageUrl () {
    return this.cachedGetter('_imageUrl', () => {
      if (!this.metadata.image) return null
      return replaceImageSrcInFile(`/${this.metadata.image}`, imageMap)
    })
  }

  get summary () {
    if (this._summary) return this._summary
    if (this.metadata.summary) {
      this._summary = this.metadata.summary
    } else {
      const truncated = truncate(this.content) + '...'
      this._summary = this.converter.makeHtml(truncated)
    }
    return this._summary
  }

  get menu () {
    return this._siteConfig.menu || []
  }

  get htmlWithImages () {
    return this.cachedGetter('_htmlWithImages', () => {
      return replaceImageSrcInFile(this.html, imageMap)
    })
  }

  get url () {
    if (this._url) return this._url
    let dir = 'dist/'
    if (this.templateName === 'posts') dir += 'posts/'
    this._url = `${dir}${newFilename(this._sourcePath)}`
    return this._url
  }

  get targetUrl () {
    return `/${this.url.slice(5)}`
  }

  save () {
    fs.writeFileSync(this.url, this.htmlWithImages)
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
    return this.cachedGetter('_templateName', () => {
      return this._sourcePath.match(/^(.*)\//)[1]
    })
  }

  get markdown () {
    return this.cachedGetter('_markdown', () => {
      return (new Markdown(this._sourcePath)).load()
    })
  }

  get metadata () {
    return this.cachedGetter('_metadata', () => {
      return this.markdown.metadata
    })
  }

  get content () {
    return this.markdown.content
  }

  get htmlContent () {
    return this.converter.makeHtml(this.content)
  }

  get converter () {
    return this.cachedGetter('_converter', () => {
      return new showdown.Converter()
    })
  }

  get compiledMetadata () {
    return this.cachedGetter('_compiledMetadata', () => {
      return (new Metadata(this.metadata)).build().metadata
    })
  }

  cachedGetter (target, calculator) {
    if (this[target]) return this[target]
    this[target] = calculator()
    return this[target]
  }
}

function truncate (str, size = 300) {
  if (str.length < size) {
    return str
  } else {
    str = str.slice(0, 300)
    const lastSpace = str.lastIndexOf(' ')
    str = str.slice(0, lastSpace)
  }
  return str
}

module.exports = HtmlDocument
