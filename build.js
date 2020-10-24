const fs = require('fs')
const glob = require('glob')
const { makeDirectories } = require('./src/util/fileServices.js')
const templates = require('./src/util/templates')
const { sortBy, reverse } = require('lodash')
makeDirectories(fs, [
  'dist',
  'dist/css',
  'dist/posts',
  'dist/data',
  'dist/images',
  'dist/js'
])

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

const docsData = documents.map(document => {
  return document.dataPoints
})

fs.writeFileSync('dist/data/documents.json', JSON.stringify({ data: docsData }))

const postsData = reverse(
  sortBy(docsData.filter(page => page.type === 'posts'), 'publishedMs')
)

const mainHtml = templates.posts_index({ posts: postsData })
new HtmlDocument({
  mainHtml,
  siteConfig,
  url: 'dist/posts/index.html',
  metadata: {}
}).save()
