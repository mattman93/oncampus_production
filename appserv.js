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

   	  socket.on("map-loaded", function(){
        console.log("CHEESE");

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
           dataArr[i].lat = parseFloat(dataArr[i].lat) + 0.0005165;
           dataArr[i].longi = parseFloat(dataArr[i].longi) + 0.0006165;
         }
       } else {
         if((dataArr[i].lat ||  dataArr[i].longi)==(dataArr[i+1].lat ||  dataArr[i+1].longi)){
                 // This is concatenating 0.0003112 onto end of string - parse to int
           dataArr[i].lat = parseFloat(dataArr[i].lat) + 0.0007165;
           dataArr[i].longi = parseFloat(dataArr[i].longi) + 0.0009165;
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
          users[from].chatPartner = to;
          users[to].chatPartner = from;
          console.log("users[TargetName]" + users[TargetName].beingRequested);
          console.log("users[selfTargetName] " + users[selfTargetName].beingRequested);
              users[TargetName].emit("show-client-req", to, from);
                        });
socket.on("accept", function(from, to){
        var emitTarget = users.indexOf(from);
        var TargetName = users[emitTarget];
          if((emitTarget == -1) || (TargetName == undefined)){
            var msg = " chat partner left =( ";
             users[to].emit("senderLeft", msg);
                 } else {
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
        console.log("------------------------------");
        console.log("user : " + users[TargetName].username);
        console.log("being requested : " + users[TargetName].beingRequested);
        console.log("isinconv : " + users[TargetName].isinconv);
        console.log("chatpartner : " + users[TargetName].chatPartner);
        console.log("------------------------------");
        console.log();
        console.log("------------------------------");
        console.log("user : " + users[otherName].username);
        console.log("being requested : " + users[otherName].beingRequested);
        console.log("isinconv : " + users[otherName].isinconv);
        console.log("chatpartner : " + users[otherName].chatPartner);
        console.log("------------------------------");
    }
        });
socket.on("decline", function(from, uname){
     //   var emitTarget = users.indexOf(from);
       // var TargetName = users[emitTarget];
        //socket.emit("dec", )
        console.log("from : " + from);
        console.log("uname : " + uname);
          users[uname].beingRequested = false;
          users[from].beingRequested = false;
          users[from].emit("requestDeclined", uname);
    });

socket.on("check_status", function(data, me){
      var msg;
      if(users[me].isinconv){
        msg = 3;
        users[me].emit("return_status", msg);
      } else {
      console.log("--------------------");
      console.log("data : " + data);
      console.log("me : " + me);
      console.log("TargetName : " + users[data].username);
      console.log("--------------------");
      if(users[data].beingRequested == true){
        msg = 0;
          users[me].emit("return_status", msg);
      } else if(users[data].isinconv == true){
          msg = 1;
          users[me].emit("return_status", msg);
          } else {
             msg = 2;
              users[me].emit("return_status", msg);
      }
    }
      console.log("msg : " + msg);

});
    socket.on("message", function(you, message){
      var TargetName = users[you];
      var TN2 = users[you].chatPartner;
      users[you].emit("sendmsg", message);
      users[TN2].emit("sendmsg", message);
      });

socket.on("end", function(uname){

  if(uname == undefined){} else {
                  if(users[uname].isinconv && users[uname].chatPartner != null){
                    var otherUser = users[uname].chatPartner;
                    users[otherUser].isinconv = false;
                    users[otherUser].beingRequested = false;
                    users[otherUser].chatPartner = null;
                    users[uname].isinconv = false;
                    users[uname].beingRequested = false;
                    users[uname].chatPartner = null;
                    users[otherUser].emit("convEnded", users[otherUser].isinconv,users[otherUser].beingRequested,users[otherUser].chatPartner);
                  }
      }
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
                  //chatpartner isn't set weiner
                   if(users[uname].beingRequested && users[uname].chatPartner != null)
                   {
                    console.log("user left");
                    console.log("chat partner " + users[uname].chatPartner);
                      var otherUser = users[uname].chatPartner;
                       users[otherUser].isinconv = false;
                        users[otherUser].beingRequested = false;
                         users[otherUser].chatPartner = null;
                          users[otherUser].emit("senderLeft");
                   }
                  if(users[uname].isinconv && users[uname].chatPartner != null){
                    //hide modal of conversation partner and reset their status
                    var otherUser = users[uname].chatPartner;
                    users[otherUser].isinconv = false;
                    users[otherUser].beingRequested = false;
                    users[otherUser].chatPartner = null;
                      console.log("-----------------------");
                      console.log("-----------------------");
                      console.log("you are  : " + otherUser);
                      console.log("isinconv : " + users[otherUser].isinconv);
                      console.log("beingRequested : " + users[otherUser].beingRequested);
                      console.log("chatPartner : " + users[otherUser].chatPartner);
                       console.log("-----------------------");
                      console.log("-----------------------");
                    users[otherUser].emit("convEnded", users[otherUser].isinconv,users[otherUser].beingRequested,users[otherUser].chatPartner);
                  }
        		users.splice(indx, 1);
            userData.splice(indx, 1);
         		io.sockets.emit("remove-marker", uname);
         		console.log("arr len : " + users.length);
            console.log("userData len : " + userData.length);
     	}
      	});


   }); //on connection
