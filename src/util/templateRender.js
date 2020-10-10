function loopedTemplateRender(template, data) {
  return data.map(item => template( item )).join("")
}

module.exports = {
  loopedTemplateRender
}
