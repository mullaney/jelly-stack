const expect = require('chai').expect
const { beforeEach, describe } = require('mocha')
const HtmlDocument = require('../src/classes/html_document')
const samplePath = 'test/fixtures/sample.md'
const sampleConfig = require('./fixtures/sampleConfig')
const sampleAssets = require('./fixtures/sampleAssets')

describe('HtmlDocument', () => {
  let htmlDocument

  beforeEach(() => {
    htmlDocument = new HtmlDocument({
      sourcePath: samplePath,
      siteConfig: sampleConfig,
      assets: sampleAssets
    })
  })

  it('is a class', () => {
    expect(htmlDocument).to.be.an.instanceOf(HtmlDocument)
  })

  it('has a sourcePath', () => {
    expect(htmlDocument._sourcePath).to.eql(samplePath)
  })

  it('has a site config', () => {
    expect(htmlDocument._siteConfig).to.eql(sampleConfig)
  })

  it('has assets which are arrays of images, css files and js files', () => {
    expect(htmlDocument._images).to.eql(sampleAssets.images)
    expect(htmlDocument._css).to.eql(sampleAssets.css)
    expect(htmlDocument._scripts).to.eql(sampleAssets.scripts)
  })

  it('has a getter for metadata', () => {
    expect(htmlDocument.metadata.title).to.equal('This is the title')
  })

  it('has a getter for content', () => {
    expect(htmlDocument.content).to.include('The first paragraph')
  })

  it('has a getter for htmlContent', () => {
    expect(htmlDocument.htmlContent).to.include('<p>The first paragraph')
  })

  it('has a getter for compiledMetadata', () => {
    expect(htmlDocument.compiledMetadata).to.include('This is the title')
  })
})
