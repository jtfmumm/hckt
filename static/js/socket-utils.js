var utils = {};
utils.socket = null;

utils.setSocket = function(socket) {
  utils.socket = socket;
};

utils.bindSocketHandlers = function() {
  utils.socket.on('state.current', function (data) {
  	console.log('received current state');
  	console.log(data);
  	state = data;
  });

  utils.socket.on('state.change', function (data) {
  	console.log('received changes in state');
  	console.log(data);
  	state = data;
  });
};