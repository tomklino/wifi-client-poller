const cheerio = require('cheerio');
const request = require('request');

const parseWifiClients = require('./project_modules/wifi_client_parser');

function loginToRouter({router_ip, username, password, path}) {
  return new Promise((resolve, reject) => {
    let post_data = {
      loginUsername: username,
      loginPassword: password,
      rememberMe: "rememberMe"
    }

    path = path || '/goform/login';

    request.post(
      'http://' + router_ip + path,
      { form: post_data },
      function(err, res, body) {
        if (res.headers['location'] === '/login.asp') {
          reject(new Error("login failed"));
        } else if (res.headers['location'] === '/RgSwInfo.asp') {
          resolve();
        } else {
          reject(new Error("unknown login error"));
        }
      }
    );
  });
}

async function fetchConnectedWifiClients({router_ip, username, password, path}) {
  await loginToRouter({router_ip, username, password});

  return new Promise((resolve, reject) => {
    if (typeof router_ip !== 'string') {
      reject(new Error('no valid router_ip provided'))
    }

    path = path || '/wlanAccess.asp';
    request.get(
      'http://' + router_ip + path,
      function(err, res, body) {
        const $ = cheerio.load(body);
        if ($('h1').html().includes("Login")) {
          console.log("not logged in")
          resolve([]);
        } else {
          resolve(parseWifiClients(body));
        }
    });
  })
}

fetchConnectedWifiClients({
  router_ip: '192.168.1.1',
  username: 'admin',
  password: 'admin'
}).then(clients => console.log(clients));
