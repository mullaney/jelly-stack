const fs = require('fs')
const Metadata = require('../metadata')
const Markdown = require('../markdown')
const showdown = require('showdown')
const templates = require('../util/templates')
const { renderedAssets } = require('../util/assetsService')
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
      styleLinks: renderedAssets.css,
      jsTags: renderedAssets.js,
      metadata: this.compiledMetadata
    }
    this._html = templates.application(options)
    return this._html
  }

  get publishedAt () {
    return this.cachedGetter('_publishedAt', () => {
      const dateTime = new Date(this.metadata.published || this.stats.mtime)
      return `${dateTime.toLocaleString()}`
    })
  }

  get stats () {
    return this.cachedGetter('_stats', () => {
      if (!this._sourcePath) return {}
      return fs.statSync(this._sourcePath)
    })
  }

  get mainHtml () {
    return this.cachedGetter('_mainHtml', () => {
      return this.template({
        content: this.htmlContent,
        ...this.metadata,
        publishedAt: this.publishedAt
      })
    })
  }

  get dataPoints () {
    if (this._dataPoints) return this._dataPoints
    this._dataPoints = {
      ...this.metadata,
      url: this.targetUrl,
      type: this.templateName,
      created_at: this.stats.birthtime,
      updated_at: this.stats.mtime,
      image_url: this.imageUrl,
      summary: this.summary,
      publishedAt: this.publishedAt
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

  get siteConfig () {
    return this._siteConfig
  }

  get markdown () {
    return this.cachedGetter('_markdown', () => {
      return (new Markdown(this._sourcePath)).load()
    })
  }

  get metadata () {
    return this.cachedGetter('_metadata', () => {
      return {
        author: this.siteConfig.author,
        ...this.markdown.metadata
      }
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
