const fs = require('fs')
const glob = require('glob')
const showdown = require('showdown')
const converter = new showdown.Converter()
const pagesDir = 'pages'
const distDir = 'dist'
const Handlebars = require('handlebars')
const indexHtml = fs.readFileSync( 'templates/index.html', 'utf-8' )
const styleLink = fs.readFileSync( 'templates/style_link.html', 'utf-8' )
const pageTemplate = Handlebars.compile(indexHtml)
const styleLinkTemplate = Handlebars.compile(styleLink)
const distDirectories = ['dist', 'dist/css']
const newCssFiles = []
const Markdown = require('./src/markdown.js')

// make a dist folder if it doesn't exist
distDirectories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
})

// Get a list of all files in pages dir
const pages = glob.sync(pagesDir + '/**/*.md')
const cssFiles = glob.sync('assets/css/**/*.css')

const newFilename = file => {
  const pathParts = file.split('/')
  const fileName = pathParts[pathParts.length - 1].split('.md')[0]
  return fileName + '.html'
}

const newCssFilename = file => {
  const pathParts = file.split('/')
  const fileNameParts = pathParts[pathParts.length - 1].split('.')
  const timestamp = String(fs.statSync(file).mtimeMs).split('.')[0]
  return `${fileNameParts[0]}.${timestamp}.${fileNameParts[1]}`
}

cssFiles.forEach(cssFile => {
  const pathParts = cssFile.split('/')
  const rootName = pathParts[pathParts.length - 1].split('.css')[0]
  const newCssFile = `dist/css/${newCssFilename(cssFile)}`
  const oldVersions = glob.sync('dist/css/' + rootName + '.*.css')

  newCssFiles.push(`css/${newCssFilename(cssFile)}`)

  if (!fs.existsSync(newCssFile)) {
    oldVersions.forEach(version => {
      if (newCssFile !== version) {
        fs.unlinkSync(version)
      }
    })
    fs.copyFileSync(cssFile, newCssFile)
  }
})



const styleLinks = newCssFiles.reduce((acc, filename) => {
  return acc + styleLinkTemplate({ cssFilename: filename })
}, '')

pages.forEach(file => {
  //get base name
  const markdown = fs.readFileSync( file, 'utf-8' )
  const html = pageTemplate({
    content: converter.makeHtml(markdown),
    styleLinks: styleLinks
  })
  fs.writeFileSync(`${distDir}/${newFilename(file)}`, html)
})
