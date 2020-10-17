const fs = require('fs')
const glob = require('glob')
const Handlebars = require('handlebars')
const templates = glob.sync('templates/**/*.html')

function name (template) {
  const regex = /templates\/(.*).html$/
  return template.match(regex)[1]
}

module.exports = templates.reduce((acc, template) => {
  const html = fs.readFileSync(template, 'utf-8')
  acc[name(template)] = Handlebars.compile(html)
  return acc
}, {})
