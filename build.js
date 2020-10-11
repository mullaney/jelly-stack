const fs = require('fs')
const glob = require('glob')
const showdown = require('showdown')

// Make directories
const { makeDirectories, newFilename } = require('./src/util/fileServices.js')
makeDirectories(fs, ['dist', 'dist/css', 'dist/images'])

// Get a list of all files in pages dir
const pagesDir = 'pages'
const pages = glob.sync(pagesDir + '/**/*.md')

const Markdown = require('./src/markdown.js')
const Metadata = require('./src/metadata.js')
const Handlebars = require('handlebars')

const { renderStyleLinks } = require('./src/util/cssService')

const mainHtml = fs.readFileSync( 'templates/main.html', 'utf-8' )
const mainTemplate = Handlebars.compile(mainHtml)

const headerHtml = fs.readFileSync( 'templates/header.html', 'utf-8' )
const headerTemplate = Handlebars.compile(headerHtml)

const applicationHtml = fs.readFileSync( 'templates/application.html', 'utf-8' )
const applicationTemplate = Handlebars.compile(applicationHtml)
const { processImagesForDistribution, replaceImageSrcInFile } = require('./src/util/imageService')
const imageMap = processImagesForDistribution()

pages.forEach(file => {
  const markdown = (new Markdown(file)).load()
  const compiledMetadata = (new Metadata(markdown.metadata)).build().metadata()
  const converter = new showdown.Converter()
  const content = converter.makeHtml(markdown.html())
  const mainHtml = mainTemplate({ content })
  console.log('headerTemplate(): ', headerTemplate());
  const html = applicationTemplate({
    header: headerTemplate(),
    main: mainHtml,
    styleLinks: renderStyleLinks(),
    title: markdown.metadata.title,
    metadata: compiledMetadata
  })
  const distDir = 'dist'
  const htmlWithImages = replaceImageSrcInFile(html, imageMap)
  fs.writeFileSync(`${distDir}/${newFilename(file)}`, htmlWithImages)
})
