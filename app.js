const http = require('http');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');

function parseWifiClients(html) {
  const dom = cheerio.load(html);
  cheerioTableparser(dom);

  let wifiClientsTableElement = dom('table').eq(2)
    .children("tbody")
    .children("tr").eq(0)
    .children("td").eq(1)

  let wifiClientsArray =
    wifiClientsTableElement
    .parsetable()
    .map((col) => {return col.filter(row => !row.includes('script'))})

  let wifiClients = [];
  wifiClientsArray[0].forEach((mac, i) => {
    wifiClients.push({
      mac,
      ip: wifiClientsArray[3][i],
      name: wifiClientsArray[4][i]
    }) 
  });

  return wifiClients;
}

http.get({
  host: '192.168.1.1',
  port: 80,
  path: '/wlanAccess.asp',
  agent: false,
  }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => { console.log(parseWifiClients(data)) });
});
