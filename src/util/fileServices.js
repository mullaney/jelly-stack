const makeDirectories = function(fs, dirs) {
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  })
}

const newFilename = file => {
  const pathParts = file.split('/')
  const fileName = pathParts[pathParts.length - 1].split('.md')[0]
  return fileName + '.html'
}

module.exports = { makeDirectories, newFilename }
