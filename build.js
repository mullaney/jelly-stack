const fs = require('fs')
const glob = require('glob')
const showdown = require('showdown')
const converter = new showdown.Converter()
const pagesDir = 'pages'
const distDir = 'dist'

// make a dist folder if it doesn't exist
if (!fs.existsSync(distDir)){
  fs.mkdirSync(distDir);
}

// Get a list of all files in pages dir
const pages = glob.sync(pagesDir + '/**/*.md')

pages.forEach(file => {
  //get base name
  const parts = file.split('/')
  const filename = parts[parts.length - 1]
  const newfilename = filename.split('.md')[0] + '.html'
  const markdown = fs.readFileSync( file, 'utf-8' )
  const html = converter.makeHtml(markdown)
  fs.writeFileSync(`${distDir}/${newfilename}`, html)
})
