const Papa = require('papaparse')

const CARDS_SOURCE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5OnXLZyogXjLSenOoBtOzqCamqwWdeNNCBTOmN9gqf5rC8I35kx-c8JfZxmw4iB4P4suRJW9fpn7x/pub?gid=167052444&single=true&output=csv'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const cards = await fetch(CARDS_SOURCE)
    .then(response => response.text())
    .then(text => Papa.parse(text, { header: true, skipEmptyLines: "greedy" }).data)
    .then(data => {
      return data.filter(d => d["Online"] === "Active")
        .map(d => ({
          question: d["Question"],
          source: d["Submitted By"]
        }));
    });
  return new Response(JSON.stringify(cards), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  })
}
