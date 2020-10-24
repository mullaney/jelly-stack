const fs = require('fs')
const glob = require('glob')
const Handlebars = require('handlebars')
const { newAssetFilename } = require('./fileServices.js')
const { loopedTemplateRender } = require('./templateRender.js')

const assetTypes = [
  {
    extension: 'css',
    template: Handlebars.compile('<link rel="stylesheet" href="{{ filename }}" />')
  },
  {
    extension: 'js',
    template: Handlebars.compile('<script src="{{ filename }}"></script>')
  }
]

class AssetBuilder {
  constructor (extension, template) {
    this._extension = extension
    this._template = template
  }

  build () {
    this.targetFiles.forEach((targetFile, i) => {
      if (!fs.existsSync(targetFile)) {
        try {
          this.removeOldVersions(targetFile, this.sourceFiles[i])
        } catch (err) {
          throw new Error('Could not remove old versions of files: ' + err)
        }

        try {
          fs.copyFileSync(this.sourceFiles[i], targetFile)
        } catch (err) {
          throw new Error('Could copy source file: ' + err)
        }
      }
    })
    return this
  }

  removeOldVersions (targetFile, sourceFile) {
    glob.sync(`dist/${this._extension}/${this.rootFileName(sourceFile)}.*.${this._extension}`).forEach(version => {
      if (targetFile !== version) {
        fs.unlinkSync(version)
      }
    })
  }

  rootFileName (path) {
    const pathParts = path.split('/')
    return pathParts[pathParts.length - 1].split('.' + this._extension)[0]
  }

  get sourceFiles () {
    return glob.sync(`assets/${this._extension}/**/*.${this._extension}`)
  }

  get targetFiles () {
    return this.sourceFiles.map(file => {
      return `dist/${this._extension}/${newAssetFilename(fs, file)}`
    })
  }

  get fileData () {
    return this.targetFiles.map(function (f) { return { filename: f.slice(4) } })
  }

  get rendered () {
    return loopedTemplateRender(this._template, this.fileData)
  }
}

module.exports = {
  renderedAssets: assetTypes.reduce((acc, type) => {
    acc[type.extension] = new AssetBuilder(type.extension, type.template).build().rendered
    return acc
  }, {})
}
