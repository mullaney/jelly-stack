const fs = require('fs')
const glob = require('glob')
const Handlebars = require('handlebars')
const { newCssFilename } = require('./fileServices.js')
const newCssFiles = []

const cssFiles = glob.sync('assets/css/**/*.css')

cssFiles.forEach(cssFile => {
  const pathParts = cssFile.split('/')
  const rootName = pathParts[pathParts.length - 1].split('.css')[0]
  const newCssFile = `dist/css/${newCssFilename(fs, cssFile)}`
  const oldVersions = glob.sync('dist/css/' + rootName + '.*.css')

  newCssFiles.push(`css/${newCssFilename(fs, cssFile)}`)

  if (!fs.existsSync(newCssFile)) {
    oldVersions.forEach(version => {
      if (newCssFile !== version) {
        fs.unlinkSync(version)
      }
    })
    fs.copyFileSync(cssFile, newCssFile)
  }
})

const styleLinkHtml = fs.readFileSync( 'templates/style_link.html', 'utf-8' )
const styleLinkTemplate = Handlebars.compile(styleLinkHtml)
const cssFilesData = newCssFiles.map( function(f) { return { cssFilename: f } })
const { loopedTemplateRender } = require('./templateRender.js')
// const styleLinks = loopedTemplateRender(styleLinkTemplate, cssFilesData)


function renderStyleLinks() {
  return loopedTemplateRender(styleLinkTemplate, cssFilesData)
}

module.exports = {
  renderStyleLinks
}
