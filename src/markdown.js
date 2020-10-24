const fs = require('fs')

class Markdown {
  constructor (path) {
    this.path = path
    this._content = null
    this._metadata = {}
  }

  load () {
    const content = fs.readFileSync(this.path, 'utf-8')
    this._metadata = parseMetadata(content)
    this._content = parseContent(content)
    return this
  }

  get content () {
    return this._content
  }

  get metadata () {
    return this._metadata
  }
}

const parseMetadata = (content) => {
  const lines = content.split('\n').map(line => line.trim())
  const beginMetadata = lines.indexOf('<!--')
  const endMetadata = lines.indexOf('-->')
  if (beginMetadata === -1 || endMetadata === -1) {
    return { title: null }
  }
  const metadataText = lines.slice(beginMetadata + 1, endMetadata)
  let json
  try {
    json = JSON.parse(`{${metadataText.join(' ')}}`)
  } catch (err) {
    throw new Error('Could not parse this metadata: \n' + metadataText.join(' ') + '\n\nPlease check carefully for trailing commas and proper use of quotation marks.\n')
  }
  return json
}

const parseContent = (content) => {
  const lines = content.split('\n').map(line => line.trim())
  const endMetadata = lines.indexOf('-->')
  return lines.slice(endMetadata + 1).join('\n')
}

module.exports = Markdown
