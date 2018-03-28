const trackerFactory = require('./project_modules/function_tracker');
const fetchConnectedWifiClients = require('./project_modules/wifi_client_fetcher');

wifiClientsTracker = trackerFactory({
  watchFunction: fetchMyWifiClients
})
.setComparator((a,b) => { return a.mac === b.mac;})
.on('element_join', (joined_elemnts) => {
  console.log("these guys joined:", joined_elemnts)
})
.on('element_left', (left_elements) => {
  console.log("those guys has left the building", left_elements)
})

setInterval(() => { wifiClientsTracker.call() }, 2000)

function fetchMyWifiClients() {
  return fetchConnectedWifiClients({
    router_ip: '192.168.1.1',
    username: 'admin',
    password: 'admin'
  })
}
