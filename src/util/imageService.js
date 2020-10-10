const fs = require('fs')
const glob = require('glob')

function processImagesForDistribution() {
  const images = glob.sync('assets/images/**/*.*')
  const fileMap = {}
  images.forEach(file => {
    const regex = /assets\/images\/(.*).(png|jpg|jpeg|svg|gif)$/
    fileMatch = file.match(regex)
    if (fileMatch) {
      const rootName = fileMatch[1]
      const extension = fileMatch[2]
      const oldVersions = glob.sync('dist/images/' + rootName + '.*.' + extension)
      const timestamp = String(fs.statSync(file).mtimeMs).split('.')[0]
      const newFile = `dist/images/${rootName}.${timestamp}.${extension}`
      if (!fs.existsSync(newFile)) {
        oldVersions.forEach(version => {
          if (newFile !== version) {
            fs.unlinkSync(version)
          }
        })
        fs.copyFileSync(file, newFile)
        console.log('file, newFile: ', file, newFile);
      }
      const assetRegex = /assets(.*)$/
      const distRegex = /dist(.*)$/
      fileMap[file.match(assetRegex)[1]] = newFile.match(distRegex)[1]
    }
  })
  return fileMap
}

function replaceImageSrcInFile(html, imageMap) {
  Object.keys(imageMap).forEach(imagePath => {
    html = html.split(imagePath).join(imageMap[imagePath])
  })
  return html
}

module.exports = {
  processImagesForDistribution,
  replaceImageSrcInFile
}
