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

   io.sockets.on('connection', function(socket){

   	socket.on("map-loaded", function(lat, longi){

	socket.emit("send-users", users);
   	});
socket.on("check-in", function(username, lat, longi){
	var user = {
   		lat: lat,
   		longi: longi,
   		username: username
   	}

   		users.push(user);
   		//console.log(socket);
   		console.log("array len: " + users.length);
   	});


   	socket.on('disconnect', function(){
   	});


   }); //on connection