const fs = require('fs')
const glob = require('glob')
const showdown = require('showdown')

// Make directories
const { makeDirectories, newFilename, newCssFilename } = require('./src/util/fileServices.js')
makeDirectories(fs, ['dist', 'dist/css'])

// Get a list of all files in pages dir
const pagesDir = 'pages'
const pages = glob.sync(pagesDir + '/**/*.md')
const cssFiles = glob.sync('assets/css/**/*.css')
const newCssFiles = []

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

const Markdown = require('./src/markdown.js')
const Metadata = require('./src/metadata.js')
const Handlebars = require('handlebars')

const styleLinkHtml = fs.readFileSync( 'templates/style_link.html', 'utf-8' )
const styleLinkTemplate = Handlebars.compile(styleLinkHtml)
const cssFilesData = newCssFiles.map( function(f) { return { cssFilename: f } })
const { loopedTemplateRender } = require('./src/util/templateRender.js')
const styleLinks = loopedTemplateRender(styleLinkTemplate, cssFilesData)

const mainHtml = fs.readFileSync( 'templates/main.html', 'utf-8' )
const mainTemplate = Handlebars.compile(mainHtml)

const applicationHtml = fs.readFileSync( 'templates/application.html', 'utf-8' )
const applicationTemplate = Handlebars.compile(applicationHtml)

pages.forEach(file => {
  const markdown = (new Markdown(file)).load()
  const compiledMetadata = (new Metadata(markdown.metadata)).build().metadata()
  const converter = new showdown.Converter()
  const content = converter.makeHtml(markdown.html())
  const mainHtml = mainTemplate({ content })
  const html = applicationTemplate({
    main: mainHtml,
    styleLinks: styleLinks,
    title: markdown.metadata.title,
    metadata: compiledMetadata
  })
  const distDir = 'dist'
  fs.writeFileSync(`${distDir}/${newFilename(file)}`, html)
})
