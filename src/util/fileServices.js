function makeDirectories(fs, dirs) {
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  })
}

function newFilename(file) {
  const pathParts = file.split('/')
  const fileName = pathParts[pathParts.length - 1].split('.md')[0]
  return fileName + '.html'
}

function newCssFilename(fs, file) {
  const pathParts = file.split('/')
  const fileNameParts = pathParts[pathParts.length - 1].split('.')
  const timestamp = String(fs.statSync(file).mtimeMs).split('.')[0]
  return `${fileNameParts[0]}.${timestamp}.${fileNameParts[1]}`
}

module.exports = {
  makeDirectories, newFilename, newCssFilename
}
