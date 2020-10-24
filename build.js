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

const numIndexPages = Math.ceil(postsData.length / siteConfig.posts_per_page)

for (let i = 0; i < numIndexPages; i++) {
  const mainHtml = templates.posts_index({
    pageNum: i,
    totalPages: numIndexPages,
    paginate: (numIndexPages > 1),
    showNext: (i < numIndexPages - 1),
    nextUrl: `/posts/index${i + 1}.html`,
    showPrev: (i > 0),
    prevUrl: `/posts/index${(i > 1) ? (i - 1) : ''}.html`,
    posts: postsData.slice(i * siteConfig.posts_per_page, (i + 1) * siteConfig.posts_per_page)
  })

  new HtmlDocument({
    mainHtml,
    siteConfig,
    url: `dist/posts/index${i > 0 ? i : ''}.html`,
    metadata: {}
  }).save()
}
