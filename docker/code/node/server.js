const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


// app.use("/", require(__dirname + '/routes/index'));
// app.use("/chat", require(__dirname + '/routes/chat'));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/chat.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');

  // メッセージ処理
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


http.listen(3000, ()=>{ console.log('listening on *:3000'); });
