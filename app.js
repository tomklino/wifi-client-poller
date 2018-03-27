const cheerio = require('cheerio');

const fetchConnectedWifiClients = require('./project_modules/wifi_client_fetcher');


fetchConnectedWifiClients({
  router_ip: '192.168.1.1',
  username: 'admin',
  password: 'admin'
}).then(clients => console.log(clients))
  .catch(err => console.error("login error", err))
