var server = require('http').createServer();
var io = require('socket.io').listen(server);
var fs = require('fs');
var path = require('path');
var url = require('url');
var http = require('http');
var mysql = require('mysql');

server.listen(8080);

  function init(request, response){
  fs.readFile(__dirname + '/index.html',
    function(err, data){
      if(err){
        response.writeHead(500);
        return response.end('error');
      } else {
      response.writeHead(200);
      response.end(data);
    }
  });
  }

  var users = [];
  var userData = [];
  var available = [];

   io.sockets.on('connection', function(socket){

   	  socket.on("map-loaded", function(lat, longi){

    	 socket.emit("send-users", userData);
   	});
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^^&*()_+";

    for( var i=0; i < 14; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function randomize(username){
  //find nearest user
  var best = Number.MAX_VALUE;
  var ind_best = 0;
  var self_lat = users[username].lat;
  var self_long = users[username].longi;
  if(available.length > 1){
    //console.log("available array length" + available.length);
    console.log("me : " + username + " lat:" + self_lat + " long: " + self_long);
    for(var x=0; x<available.length; x++){
      //sort by distance
          var distLong = self_long - available[x].longi;
          var distLat = self_lat - available[x].lat;
          var res = Math.abs(distLong + distLat);
         if(res < best && res != 0){
            best = res;
            ind_best = x;
          }
      console.log("distance from " + available[x].username + " : " + res);
    }
    console.log("CLOSEST CHAT PARTNER = " + available[ind_best].username);
  }
}
socket.on("check-in", function(username, lat, longi){
      	var user = {
         		lat: lat,
         		longi: longi,
         		username: username,
         	}
          	var id = makeid();
             socket.user = id
             socket.username = username;
             users[socket.username] = socket;
             socket.Rid = id;
             socket.lat = lat;
             socket.longi = longi;
             users.push(socket.username);
             userData.push(user);
               		console.log("array len: " + users.length);
                   available.push(user);
                   randomize(username);
               		socket.broadcast.emit("update-map", userData);

        });


socket.on("chat-request", function(to, from){
          console.log('##### request received on server #####');
          var emitTarget = users.indexOf(to);
          var TargetName = users[emitTarget];
          console.log("emitTarget" + emitTarget);
          console.log("TargetName " + TargetName);
              users[TargetName].emit("show-client-req", to, from);
        });


socket.on('disconnect', function(){
     		var uname = socket.username;
     		if(uname == undefined){} else {
         		for(var x=0; x<users.length; x++){
                		if(users[x]== uname){
                			indx = x;
                		}
                	}

        		users.splice(indx, 1);
            userData.splice(indx, 1);
         		io.sockets.emit("remove-marker", uname);
         		console.log("arr len : " + users.length);
            console.log("userData len : " + userData.length);
     	}
      	});


   }); //on connection
