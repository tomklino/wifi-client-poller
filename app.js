const fs = require('fs');
const trackerFactory = require('function-tracker');

const fetchConnectedWifiClients = require('./project_modules/wifi_client_fetcher');

let log_destination = '/tmp/test.log';

log_fd = fs.openSync(log_destination, 'a+');

function writeToLog(line) {
  let now = (new Date()).toString()
  fs.write(log_fd, now + ": " + line + "\n", null, 'utf8', (err) => {
    if(err) {
      console.error(now, "error while writing to log");
    }
  })
}

wifiClientsTracker = trackerFactory({
  watchFunction: fetchMyWifiClients
})
.setComparator((a,b) => { return a.mac === b.mac;})
.on('element_join', (joined_elemnts) => {
  writeToLog("joined: " + JSON.stringify(joined_elemnts))
})
.on('element_left', (left_elements) => {
  writeToLog("left: " + JSON.stringify(left_elements))
})

setInterval(() => { wifiClientsTracker.call() }, 2000)

function fetchMyWifiClients() {
  return fetchConnectedWifiClients({
    router_ip: '192.168.1.1',
    username: 'admin',
    password: 'admin'
  })
}
