const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


// app.use("/", require(__dirname + '/routes/index'));
// app.use("/chat", require(__dirname + '/routes/chat'));
// app.use("/test", require(__dirname + '/routes/index'));

const users = [];
const messages = [];

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/chat.html'));
});

io.on('connection', function(socket){
  console.log(`a user(${socket.id}) connected.`);
  if (!users.includes(socket.id)) {
    users.push(socket.id);
    io.emit('chat user', users);
  }
  if (messages.length) {
    io.to(socket.id).emit('chat message', messages);
  }

  socket.on('chat message', function(msg){
    console.log('# message', msg);
    const data = { id: socket.id, msg:msg, time:new Date().toLocaleString('sv') };

    messages.push(data);
    io.emit('chat message', data);
  });
});


http.listen(3000, ()=>{ console.log('listening on *:3000'); });
