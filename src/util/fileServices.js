const makeDirectories = function(fs, dirs) {
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  })
}

module.exports = { makeDirectories }
