(function getData () {
  return fetch('/data/documents.json')
    .then(response => response.json())
    .then(json => console.log(json))
})()
