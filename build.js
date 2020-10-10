import fs from 'fs'
import glob from 'glob'
import showdown from 'showdown'
const converter = new showdown.Converter()
const pagesDir = 'pages'
const distDir = 'dist'
import Handlebars from 'handlebars'
const indexHtml = fs.readFileSync( 'templates/index.html', 'utf-8' )
const styleLink = fs.readFileSync( 'templates/style_link.html', 'utf-8' )
const pageTemplate = Handlebars.compile(indexHtml)
const styleLinkTemplate = Handlebars.compile(styleLink)
const newCssFiles = []
import { loopedTemplateRender } from './src/util/templateRender.js'

// Make directories
import { makeDirectories, newFilename, newCssFilename } from './src/util/fileServices.js'
makeDirectories(fs, ['dist', 'dist/css'])
import Markdown from './src/markdown.js'
import Metadata from './src/metadata.js'


// Get a list of all files in pages dir
const pages = glob.sync(pagesDir + '/**/*.md')
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

const cssFilesData = newCssFiles.map( function(f) { return { cssFilename: f } })
const styleLinks = loopedTemplateRender(styleLinkTemplate, cssFilesData)

pages.forEach(file => {
  const markdown = (new Markdown(file)).load()
  const compiledMetadata = (new Metadata(markdown.metadata)).build().metadata()
  const html = pageTemplate({
    content: converter.makeHtml(markdown.html()),
    styleLinks: styleLinks,
    title: markdown.metadata.title,
    metadata: compiledMetadata
  })
  fs.writeFileSync(`${distDir}/${newFilename(file)}`, html)
})
