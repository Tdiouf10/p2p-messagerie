let os = require("os");
let express = require("express");
let app = express();
let http = require("http");
let socketIO = require("socket.io");

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index.ejs");
});

let server = http.Server(app);

server.listen(8080, function () {
  console.log("Starting server on port 8080");
});

let io = socketIO(server);

io.sockets.on("connection", function (socket) {
    function log() {
        let array = ["Message from server:"];
        array.push.apply(array, arguments);
        socket.emit("log", array);
    }

    socket.on("message", function (message) {
        log("Client said: ", message);
        socket.broadcast.emit("message", message);
    });

    socket.on("create or join", function (room, clientName) {
        log("Received request to create or join room " + room);
    
        let clientsInRoom = io.sockets.adapter.rooms.get(room);
    
        let numClients = clientsInRoom ? clientsInRoom.size : 0;
        log("Room " + room + " now has " + numClients + " client(s)");
    
        if (numClients === 0) {
          socket.join(room);
          log("Client ID " + socket.id + " created room " + room);
          socket.emit("created", room, socket.id);
        } else if (numClients === 1) {
          log("Client ID " + socket.id + " joined room " + room);
          //this message ("join") will be received only by the first client since the client has not joined the room yet
          io.sockets.in(room).emit("join", room, clientName); //this client name is the name of the second client who wants to join
          socket.join(room);
          //this mesage will be received by the second client
          socket.emit("joined", room, socket.id);
          //this message will be received by two cleints after the join of the second client
          io.sockets.in(room).emit("ready");
        } else {
          // pour l'instant il n'y a que 2 clients
          socket.emit("full", room);
        }
      });


      socket.on("creatorname", (room,client) => {
        socket.to(room).emit("mynameis",client);
      });
    
      socket.on("ipaddr", function () {
        let ifaces = os.networkInterfaces();
        for (const dev in ifaces) {
          ifaces[dev].forEach(function (details) {
            if (details.family === "IPv4" && details.address !== "127.0.0.1") {
              socket.emit("ipaddr", details.address);
            }
          });
        }
      });
    
      socket.on("bye", function () {
        console.log("received bye");
      });
});
