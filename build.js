const fs = require('fs')
const glob = require('glob')
const showdown = require('showdown')
const converter = new showdown.Converter()
const pagesDir = 'pages'
const distDir = 'dist'
const Handlebars = require('handlebars')
const indexHtml = fs.readFileSync( 'templates/index.html', 'utf-8' )
const pageTemplate = Handlebars.compile(indexHtml)

// make a dist folder if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Get a list of all files in pages dir
const pages = glob.sync(pagesDir + '/**/*.md')

const newFilename = file => {
  const pathParts = file.split('/')
  const fileName = pathParts[pathParts.length - 1].split('.md')[0]
  return fileName + '.html'
}

pages.forEach(file => {
  //get base name
  const markdown = fs.readFileSync( file, 'utf-8' )
  const html = pageTemplate({ content: converter.makeHtml(markdown) })
  fs.writeFileSync(`${distDir}/${newFilename(file)}`, html)
})
