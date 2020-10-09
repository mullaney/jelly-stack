const expect = require('chai').expect
const Markdown = require('../src/markdown.js')
const samplePath = 'test/fixtures/sample.md'

describe('Markdown', () => {
  it('is a class', () => {
    expect(new Markdown()).to.be.an.instanceOf(Markdown)
  })

  describe('load()', () => {
    it('loads metadata and markdown from file', () => {
      const md = new Markdown(samplePath)
      md.load()
      expect(md.metadata).to.eql({ meta: "data" })
    })
  })
})
