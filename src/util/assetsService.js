const fs = require('fs')
const glob = require('glob')
const Handlebars = require('handlebars')
const { newAssetFilename } = require('./fileServices.js')
const { loopedTemplateRender } = require('./templateRender.js')

const assetTypes = [
  {
    type: 'css',
    template: Handlebars.compile('<link rel="stylesheet" href="{{ filename }}" />')
  },
  {
    type: 'js',
    template: Handlebars.compile('<script src="{{ filename }}"></script>')
  }
]

const renderedAssets = assetTypes.reduce((acc, assetType) => {
  acc[assetType.type] = loopedTemplateRender(assetType.template, fileData(assetType.type))
  return acc
}, {})

function fileData (extension) {
  const newFiles = []
  const files = glob.sync(`assets/${extension}/**/*.${extension}`)
  files.forEach(file => {
    const newFile = `dist/${extension}/${newAssetFilename(fs, file)}`
    const oldVersions = glob.sync(`dist/${extension}/${rootFileName(file)}.*.${extension}`)

    newFiles.push(`/${extension}/${newAssetFilename(fs, file)}`)

    if (!fs.existsSync(newFile)) {
      oldVersions.forEach(version => {
        if (newFile !== version) {
          fs.unlinkSync(version)
        }
      })
      fs.copyFileSync(file, newFile)
    }
  })
  return newFiles.map(function (f) { return { filename: f } })
}

function rootFileName (path, extension) {
  const pathParts = path.split('/')
  return pathParts[pathParts.length - 1].split('.' + extension)[0]
}

module.exports = {
  renderedAssets
}
