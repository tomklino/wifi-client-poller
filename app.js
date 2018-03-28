const trackerFactory = require('./project_modules/function_tracker');
const fetchConnectedWifiClients = require('./project_modules/wifi_client_fetcher');

wifiClientsTracker = trackerFactory({
  watchFunction: fetchMyWifiClients
})

wifiClientsTracker.on('element_join', (joined_elemnts) => {
  console.log("these guys joined:", joined_elemnts)
})

wifiClientsTracker.on('element_left', (left_elements) => {
  console.log("those guys has left the building", left_elements)
})

wifiClientsTracker.setComparator((a,b) => {
  return a.mac === b.mac;
})

setInterval(() => { wifiClientsTracker.call() }, 2000)

function fetchMyWifiClients() {
  return fetchConnectedWifiClients({
    router_ip: '192.168.1.1',
    username: 'admin',
    password: 'admin'
  })
}
