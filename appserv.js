var server = require('http').createServer();
var io = require('socket.io').listen(server);
var fs = require('fs');
var path = require('path');
var url = require('url');
var http = require('http');
var mysql = require('mysql')

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

   io.sockets.on('connection', function(socket){

   	  socket.on("map-loaded", function(lat, longi){

    	 io.sockets.emit("send-users", userData);
   	});
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^^&*()_+";

    for( var i=0; i < 14; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text; 
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
         	//	console.log(socket);
               		console.log("array len: " + users.length);
               		io.sockets.emit("update-map", userData);
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