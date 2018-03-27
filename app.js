const http = require('http');
const parseWifiClients = require('./project_modules/wifi_client_parser');

function fetchConnectedWifiClients(router_ip, path) {
  return new Promise((resolve, reject) => {
    if (typeof router_ip !== 'string') {
      reject(new Error('no valid router_ip provided'))
    }

    http.get({
      host: router_ip,
      port: 80,
      path: path || '/wlanAccess.asp',
      agent: false,
      }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(parseWifiClients(data));
      });
    });
  })
}

fetchConnectedWifiClients('192.168.1.1')
  .then(clients => console.log(clients));
