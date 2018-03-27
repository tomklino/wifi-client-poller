const http = require('http');
const parseWifiClients = require('./project_modules/wifi_client_parser');

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
