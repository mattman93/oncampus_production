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
function mod_loc(dataArr){
  for(var i=0; i < dataArr.length; i++){
  if(dataArr.length > 1){
       if(i == dataArr.length-1){
          if((dataArr[i].lat ||  dataArr[i].longi)==(dataArr[i-1].lat ||  dataArr[i-1].longi)){
             // This is concatenating 0.0003112 onto end of string - parse to int
           dataArr[i].lat = parseFloat(dataArr[i].lat) + 0.0003165;
           dataArr[i].longi = parseFloat(dataArr[i].longi) + 0.0003165;
         }
       } else {
         if((dataArr[i].lat ||  dataArr[i].longi)==(dataArr[i+1].lat ||  dataArr[i+1].longi)){
                 // This is concatenating 0.0003112 onto end of string - parse to int
           dataArr[i].lat = parseFloat(dataArr[i].lat) + 0.0003165;
           dataArr[i].longi = parseFloat(dataArr[i].longi) + 0.0003165;
         }
   }
 }
}
}
socket.on("check-in", function(username, lat, longi){
      	var user = {
         		lat: lat,
         		longi: longi,
         		username: username,
             beingRequested : false,
             isinconv : false,
             chatPartner : null,
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
             mod_loc(users);
             mod_loc(userData);
               		console.log("array len: " + users.length);
               		  socket.broadcast.emit("update-map", userData);
        });


socket.on("chat-request", function(to, from){
          console.log('##### request received on server #####');
          var emitTarget = users.indexOf(to);
          console.log("emitTarget " + emitTarget);
          var TargetName = users[emitTarget];
          var selfTarget = users.indexOf(from);
          console.log("selfTarget " + selfTarget);
          var selfTargetName = users[selfTarget];
          users[selfTargetName].beingRequested = true;
          users[TargetName].beingRequested = true;
          console.log("users[TargetName]" + users[TargetName].beingRequested);
          console.log("users[selfTargetName] " + users[selfTargetName].beingRequested);
              users[TargetName].emit("show-client-req", to, from);
        });
socket.on("accept", function(from, to){

        var emitTarget = users.indexOf(from);
        var TargetName = users[emitTarget];
        console.log("emitTarget" + emitTarget);
        console.log("TargetName " + TargetName);
        var other = users.indexOf(to);
        var otherName = users[other];
        users[TargetName].beingRequested = false;
        users[otherName].beingRequested = false;
        users[TargetName].isinconv = true;
        users[otherName].isinconv = true;
        users[TargetName].chatPartner = users[otherName].username;
        users[otherName].chatPartner = users[TargetName].username;
        users[otherName].emit("joined", to, from);
        users[TargetName].emit("joined", to, from);
        });
socket.on("decline", function(data){
        var emitTarget = users.indexOf(from);
        var TargetName = users[emitTarget];
        //socket.emit("dec", )
    });

socket.on("check_status", function(data, me){
      var msg;
      var emitTarget = users.indexOf(data);
      var TargetName = users[emitTarget];
      var self = users.indexOf(me);
      var selfName = users[self];
      if(users[TargetName].beingRequested == true){
        msg = 0;
          users[selfName].emit("return_status", msg);
      } else if(users[TargetName].isinconv == true){
          msg = 1;
          users[selfName].emit("return_status", msg);
          } else {
             msg = 2;
              users[selfName].emit("return_status", msg);
      }
});
    socket.on("message", function(data1, data2, message){
      var emitTarget = users.indexOf(data1);
      var TargetName = users[emitTarget];
      var eT2 = users.indexOf(data2);
      var TN2 = users[eT2];
      users[TargetName].emit("sendmsg", message);
      users[TN2].emit("sendmsg", message);
      });


socket.on('disconnect', function(){
  //check if was in conversation or sending/pending a request
  // if so then send
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
