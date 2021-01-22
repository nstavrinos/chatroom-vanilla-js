const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mysql=require('mysql');
const moment = require('moment');
const cors=require('cors');

const db = mysql.createConnection({
    host: "localhost",
    portt:"3306",
    user: "root",
    password: "rootpassword",
    database : 'new_database'
  });
  
db.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log("Connected!");
 });


const app = express();
const server = http.createServer(app);
app.use(cors());
//const io = socketio(server);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// Run when client connects
io.on('connection', socket => {

    db.query('SELECT * FROM messages', function (error, result) {
        if (error) {
            throw error;
        }
 
    //  var  result="hello new friend";

        console.log("new connection");
        socket.emit('message', result);
      });

  // Listen for chatMessage
    socket.on('chatMessage', msg => { 
      msg.time=moment().format('h:mm a');
      let sql = 'insert into messages(username, message,time) values ( ?, ?,?)';
      let values = [msg.username, msg.message, msg.time];
    
    db.query(sql, values, function (err, result) {
        if (err) {
            throw err;
        }
        io.emit('message',[msg]);
      });
   
     });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));