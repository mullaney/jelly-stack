const Handlebars = require('handlebars')
const meta = Handlebars.compile('  <meta name="{{ name }}" content="{{ content }}">')
const ogMeta = Handlebars.compile('  <meta property="{{ property }}" content="{{ content }}">')

class Metadata {
  constructor (data = {}) {
    this.data = data
    this._metadata = null
  }

  build () {
    const metadata = []
    if (this.data.author) {
      metadata.push(meta({ name: 'author', content: this.data.author }))
    }
    if (this.data.description) {
      metadata.push(meta({ name: 'description', content: this.data.description }))
      metadata.push(ogMeta({ property: 'og:description', content: this.data.description }))
    }
    if (this.data.image) {
      metadata.push(ogMeta({ property: 'og:image', content: this.data.image }))
    }
    if (this.data.title) {
      metadata.push(ogMeta({ property: 'og:title', content: this.data.title }))
    }
    this._metadata = metadata.join('\n')
    return this
  }

  metadata () {
    return this._metadata
  }
}

module.exports = Metadata
