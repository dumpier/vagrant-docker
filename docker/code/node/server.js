const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.use("/", require(__dirname + '/routes/index'));
app.use("/chat", require(__dirname + '/routes/chat'));


// socket.io
const data = { users:[], msgs:[],};
io.on('connection', (socket)=>{
  const ChatRoom = require('./libs/chatroom');
  ChatRoom.instance().handle(io, socket, data);
});

http.listen(3000, ()=>{ console.log('listening on *:3000'); });
