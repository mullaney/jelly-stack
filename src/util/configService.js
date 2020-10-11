const fs = require('fs')
const yaml = require('js-yaml')

function getConfig() {
  try {
    return yaml.safeLoad(fs.readFileSync('./config/site.yml', 'utf8'));
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = { getConfig }
