const fs = require('fs')
const glob = require('glob')
const HtmlDocument = require('./src/classes/html_document')

// Make directories
const { makeDirectories } = require('./src/util/fileServices.js')
makeDirectories(fs, ['dist', 'dist/css', 'dist/images'])

// Get a list of all files in pages dir
const pagesDir = 'pages'
const pages = glob.sync(pagesDir + '/**/*.md')

const siteConfig = require('./config/config')

pages.forEach(file => {
  new HtmlDocument({
    sourcePath: file,
    siteConfig
  }).save()
})
