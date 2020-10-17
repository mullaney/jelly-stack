const templates = require('../../src/util/templates')
const expect = require('chai').expect

describe('templates', () => {
  it('is an object', () => {
    expect(typeof templates).to.equal('object')
  })

  it('contains Handlebars template functions', () => {
    expect(templates.application).to.be.instanceOf(Function)
  })
})
