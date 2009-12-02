talker.js
=========

(C) Chris Williams (voodootikigod@gmail.com) 2009, Licensed under the MIT-LICENSE

An client library for accessing [Talker](http://talkerapp.com) [API services](http://talkerapp.com/api/rest). It wraps up the streaming JSON API protocol and makes it consumable through various callbacks which are passed the returned JSON object. I have provided a simple logger application, aptly named logger.js, that simply records daily logs of activity.


# Usage
1) Get a Talker account at https://talkerapp.com/signup

2) Get your Talker Token on https://user_name.talkerapp.com/settings

3) Find the Room ID you want to connect to. This is the last part of the URL:

     https://user_name.talkerapp.com/rooms/<room_id>

4) Either update the provided config.template.js with the values or just use an inline object to pass the configuration to a _new talker.Client(confg)_. Example:

    var talker = require("./lib/talker"), repl= require("repl");
    log_client = new talker.Client(config);
    log_client.connect();

5) Register your callbacks using the API below.


    log_client.addListener("message", function(msg) {
      sys.puts(obj.user.name+': '+obj.content);
    });

6) Run using _node filename.js_ and enjoy the good life.
    
**NOTE**: You must have either a _repl("")_ call or some other keep alive construct at the end of your code to keep the server up so the data can continually stream. REPL nicely blocks for you, so its a bit more efficient and effective, especially since you can use it to dynamically update your client.


# Callbacks
You do not need to register any of these and if you are using the REPL, you can register them at any time and they will work. 

## <code>connected</code>
Called when the user is authenticated and ready to receive events. "user" is a Hash containing your user info: <code>{"id"=>1, "name"=>"macournoyer", "email"=>"macournoyer@talkerapp.com"}</code>.

## <code>presence(users)</code>
Called after <code>connected</code> with the list of connected users. With <code>users</code> being something like this:

    [{"id"=>1, "name"=>"macournoyer", "email"=>"macournoyer@talkerapp.com"},
     {"id"=>2, "name"=>"gary", "email"=>"gary@talkerapp.com"}]
     
## <code>message</code>
Called when a new message is received.

## <code>private_message(user, message)</code>
Called when a new private message is received.
<code>user</code> is the sender.

## <code>join(user)</code>
Called when a user joins the room.

## <code>idle(user)</code>
Called when a user becomes idle (closed connection without leaving).

## <code>back(user)</code>
Called when a user is back from idle.

## <code>leave(user)</code>
Called when a user leaves.

## <code>close</code>
Called when the connection is closed.

## <code>error(error_message)</code>
Called when an error is received from the Talker server.

## <code>event(event)</code>
Called when any kind of event (all of the above) is received. "event" is a Hash: <code>{"type":"event type","id":"unique ID",... event specific attributes}</code>.

**NOTE** API Documentation has been ported from Marc-Andr&eacute; Cournoyer [Ruby version](http://github.com/macournoyer/talker.rb/blob/master/README.md).

# Credits

Thanks go to [Marc-Andr&eacute; Cournoyer](http://twitter.com/macournoyer) and [Gray Haran](http://twitter.com/xutopia) for talker app. Who ever buys my next beer will get their name in shining lights here!
