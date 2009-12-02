var sys    = require('sys'),
    tcp    = require('tcp');

function bind(fn, scope) {
  var bindArgs = Array.prototype.slice.call(arguments);
  bindArgs.shift();
  bindArgs.shift();

  return function() {
    var args = Array.prototype.slice.call(arguments);
    fn.apply(scope, bindArgs.concat(args));
  };
}

function each(set, iterator) {
  for (var i = 0; i < set.length; i++) {
    var r = iterator(set[i], i);
    if (r === false) {
      return;
    }
  }
}

var Client = function(config) {
  
  if (!config["host"]) { config["host"] = "talkerapp.com"; }
  if (!config["port"]) { config["port"] = 8500; }
  if (!config["user_name"]) {
    throw new Exception("You must provide an user_name.");
  }
  if (!config["token"]) {
    throw new Exception("You must provide your token available at: https://"+config["user_name"]+"."+config["host"]+"/settings#api");
  }
  if (!config["room"]) {
    throw new Exception("You must provide the room to watch. It is a number value in the subdirectory 'rooms'.");
  }
  this.host = [config["user_name"],config["host"]].join('.');
  this.port = config["port"];
  this.connection = null;
  this.buffer = '';
  this.encoding = 'utf8';
  this.timeout = 10 * 60 * 60 * 1000;
  this.token = config["token"];
  this.room = config["room"];
  this.keepalive = null;
}

sys.inherits(Client, process.EventEmitter);    

Client.prototype.close = function() {
  this.send({type: "close"});
}


    

Client.prototype.disconnect = function(why) {
  if (this.connection.readyState !== 'closed') {
    this.connection.close();
    sys.puts('disconnected (reason: '+why+')');
  }
};



Client.prototype.send = function(arg1) {
  if (this.connection.readyState !== 'open') {
    return this.disconnect('cannot send with readyState: '+this.connection.readyState);
  }

  var message = [];
  for (var i = 0; i< arguments.length; i++) {
    if (typeof arguments[i] =="string") {
      message.push(arguments[i]);
    } else {
      message.push(JSON.stringify(arguments[i]));
    }
  }
  message = message.join(' ');

  sys.puts('> '+message);
  message = message + "\r\n";
  this.connection.send(message, this.encoding);
};

Client.prototype.ping = function() {
    this.send({type: "ping"});
}

Client.prototype.pingTime = function () { return 2000 };

Client.prototype.onConnect = function() {
  this.send({room: this.room, token: this.token, type: "connect"});
  
  var spinner = (function (that) {
    return function spinner () {
      that.ping();
      setTimeout(spinner, that.pingTime());
    }
  })(this);
  setTimeout(spinner, this.pingTime());
};



Client.prototype.onEof = function() {
  this.disconnect('eof');
};

Client.prototype.onTimeout = function() {
  this.disconnect('timeout');
};

Client.prototype.onClose = function() {
  this.disconnect('close');
};


Client.prototype.onReceive = function(chunk) {
  this.buffer = this.buffer + chunk;
  
  while (this.buffer) {
    var offset = this.buffer.indexOf("\n");
    if (offset < 0) {
      return;
    }
  
    var message = this.buffer.substr(0, offset);
    this.buffer = this.buffer.substr(offset + 1);
    sys.puts('< '+message);
    
    message = JSON.parse(message);
    
    this.emit.apply(this, [message.type, message]);
    this.emit.apply(this, ['event', message]);
  
  }
};

Client.prototype.connect = function()    {
  var connection = tcp.createConnection(this.port, this.host);
  connection.setEncoding(this.encoding);
  connection.setTimeout(this.timeout);
  connection.addListener('connect', bind(this.onConnect, this));
  connection.addListener('receive', bind(this.onReceive, this));
  connection.addListener('eof', bind(this.onEof, this));
  connection.addListener('timeout', bind(this.onTimeout, this));
  connection.addListener('close', bind(this.onClose, this));
  this.connection = connection;
}
exports.Client = Client;