const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const request = require('request');

module.exports = fetchConnectedWifiClients;

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
  try {
    await loginToRouter({router_ip, username, password});
  } catch (err) {
    return Promise.reject(err);
  }
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
          reject(new Error("login error"));
        } else {
          resolve(parseWifiClients(body));
        }
    });
  })
}

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

