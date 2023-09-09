const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use("/", require(__dirname + '/routes/index'));
app.use("/chat", require(__dirname + '/routes/chat'));


const data = {
  users:[],
  msgs:[],
};


io.on('connection', (socket)=>{
  console.log(`a user(${socket.id}) connected.`);
  if (!data.users.includes(socket.id)) {
    data.users.push(socket.id);
    io.emit('chat user', data.users);
  }
  if (data.msgs.length) {
    io.to(socket.id).emit('chat message', data.msgs);
  }

  socket.on('chat message', function(msg){
    console.log('# message', msg);
    const chat = { id: socket.id, msg:msg, time:new Date().toLocaleString('sv'), };

    data.msgs.push(chat);
    io.emit('chat message', chat);
  });

  socket.on("disconnect",()=>{
    console.log("a user(${socket.id}) disconnect.");
    data.users = data.users.filter((user)=>{ return user!=socket.id });
    io.emit('chat user', data.users);
  });
});



http.listen(3000, ()=>{ console.log('listening on *:3000'); });
