const fs = require('fs')
const glob = require('glob')
const { makeDirectories } = require('./src/util/fileServices.js')
makeDirectories(fs, ['dist', 'dist/css', 'dist/posts'])

const HtmlDocument = require('./src/classes/html_document')

// Get a list of all files in pages dir
const pages = [
  ...glob.sync('pages/**/*.md'),
  ...glob.sync('posts/**/*.md')
]

const siteConfig = require('./config/config')

pages.forEach(file => {
  new HtmlDocument({
    sourcePath: file,
    siteConfig
  }).save()
})
