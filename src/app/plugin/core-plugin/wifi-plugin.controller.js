class WifiPluginController {
  constructor($scope, socketService, mockService, $log, $translate) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    this.$log = $log;
    this.$translate = $translate;
    //this.wirelessNetworks = mockService.get('wirelessNetworks');
    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
  }

  insertPassword(index) {
    this.wirelessNetworks.available.forEach((item, i) => {
      if (i !== index) {
        this.wirelessNetworks.available[i].insertPassword = undefined;
      } else {
        this.wirelessNetworks.available[i].insertPassword = true;
      }
    });
  }

  connectToWifi(wifi, index) {
    let saveWiFi = {
      ssid: wifi.ssid,
      encryption: wifi.encryption,
      password: wifi.password
    };
    this.wirelessNetworks.available[index].insertPassword = undefined;
    this.$log.debug('connect to', wifi, saveWiFi);
    this.socketService.emit('saveWirelessNetworkSettings', saveWiFi);
  }

  cancelConnectToWifi(wifi) {
    wifi.insertPassword = undefined;
  }

  refreshWifiNetworks() {
    this.socketService.emit('getWirelessNetworks', '');
  }

  disconnectFromWiFi() {}

  registerListner() {
    this.socketService.on('pushWirelessNetworks', (data) => {
      this.$log.debug('pushWirelessNetworks', data);
      this.wirelessNetworks = data;
      if (!this.wirelessNetworks.available) {
        this.wirelessNetworks.available = [];
      }
      this.wirelessNetworks.available.push({
        security: '',
        signal: -1,
        ssid: 'Connect to Hidden Network',
        ssidHidden: true
      });
    });
    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushWirelessNetworks');
    });
  }

  initService() {
    this.socketService.emit('getWirelessNetworks');
  }
}

export default WifiPluginController;
