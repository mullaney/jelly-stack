const fs = require('fs')
const glob = require('glob')
const Handlebars = require('handlebars')
const { newCssFilename } = require('./fileServices.js')

const styleLinkHtml = fs.readFileSync('templates/style_link.html', 'utf-8')
const styleLinkTemplate = Handlebars.compile(styleLinkHtml)
const { loopedTemplateRender } = require('./templateRender.js')

function renderStyleLinks () {
  return loopedTemplateRender(styleLinkTemplate, cssFilesData())
}

function cssFilesData () {
  const newCssFiles = []
  const cssFiles = glob.sync('assets/css/**/*.css')
  cssFiles.forEach(cssFile => {
    const newCssFile = `dist/css/${newCssFilename(fs, cssFile)}`
    const oldVersions = glob.sync('dist/css/' + rootFileName(cssFile) + '.*.css')

    newCssFiles.push(`/css/${newCssFilename(fs, cssFile)}`)

    if (!fs.existsSync(newCssFile)) {
      oldVersions.forEach(version => {
        if (newCssFile !== version) {
          fs.unlinkSync(version)
        }
      })
      fs.copyFileSync(cssFile, newCssFile)
    }
  })
  return newCssFiles.map(function (f) { return { cssFilename: f } })
}

function rootFileName (path) {
  const pathParts = path.split('/')
  return pathParts[pathParts.length - 1].split('.css')[0]
}

module.exports = {
  renderStyleLinks
}
