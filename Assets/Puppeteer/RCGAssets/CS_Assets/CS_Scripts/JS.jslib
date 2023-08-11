mergeInto(LibraryManager.library, {

  Hello: function () {
    window.alert("Hello, world!");
  },

  connectWalletJS: function () {
    connectWallet();
  },

  getTokenBalanceJS: function() {
    getTokenBalance();
  },

  buyCreditJS: function(tokenAmount) {
    buyCredit(UTF8ToString(tokenAmount));
  },
  
  checkConnectedJS: function() {
    var connected = checkConnected();
    return connected;
  }
})