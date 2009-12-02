var config = require("./logger_config"),
    talker = require("./lib/talker"),
    sys = require("sys"),
    file   = require('file'),
    path   = require('path')
    repl   = require('repl');


//
// Logging component was adapted from http://github.com/felixge/nodelog/
// 
var logFile, day;
function writeLog(text) {
  var date = new Date;
  var today = [
     date.getFullYear(),
     // Poor man's zero padding FTW
     ('0'+(date.getMonth()+1)).substr(-2),
     ('0'+date.getDate()).substr(-2),
  ].join('-');

  if (!logFile || day !== today) {
    logFile = new file.File(path.join('log', today+'.txt'), 'a+', {encoding: 'utf8'});
    day = today;
  }

  var time = [
    ('0'+date.getHours()).substr(-2),
    ('0'+date.getMinutes()).substr(-2)
  ].join(':');
  logFile.write('['+time+'] '+text+"\n");
}
    
    
    
// Leave in the global space so the REPL can access if need be.
// Streaming Hot Logging FTW.    
log_client = new talker.Client(config);
log_client.connect();
log_client.addListener("message", function(msg) {
  writeLog(obj.user.name+': '+obj.content);
});
log_client.addListener("join", function(obj) {
  writeLog(obj.user.name+' <'+obj.user.email+'> joined the room.');
});
log_client.addListener("connected", function(obj) {
  writeLog('Started Logging.');
});
log_client.addListener("leave", function(obj) {
  writeLog(obj.user.name+' <'+obj.user.email+'> left the room.');
});


repl.start("");