const fs = require('fs')
const glob = require('glob')
const { makeDirectories } = require('./src/util/fileServices.js')
makeDirectories(fs, ['dist', 'dist/css', 'dist/posts', 'dist/data'])

const HtmlDocument = require('./src/classes/html_document')

// Get a list of all files in pages dir
const pages = [
  ...glob.sync('pages/**/*.md'),
  ...glob.sync('posts/**/*.md')
]

const siteConfig = require('./config/config')

const documents = pages.map(path => {
  return new HtmlDocument({
    sourcePath: path,
    siteConfig
  }).save()
})

const docData = documents.map(document => {
  return document.dataPoints
})

fs.writeFileSync('dist/data/documents.json', JSON.stringify(docData))
