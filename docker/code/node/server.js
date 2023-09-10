const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


// publicフォルダの静的リソース
app.use(express.static('public'));
app.use("/", require(__dirname + '/routes/index'));
app.use("/chat", require(__dirname + '/routes/chat'));
// require("./libs/router").instance().dispatch();


// socket.io
const data = {users:[], msgs:[]};
// const storage = require('./libs/chat/storage').instance();
io.on('connection', (socket)=>{
  // require('./libs/chat/eventold').instance().handle(io, socket, data);
  require('./libs/chat/event').instance().handle(io, socket, data);
});

http.listen(3000, ()=>{ console.log('listening on *:3000'); });

