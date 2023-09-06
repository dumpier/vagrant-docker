// Expressをrequire
var app = require('express')();
// httpモジュールをrequire
var http = require('http').Server(app);
var io = require('socket.io')(http);

// ディレクトリでindex.htmlをリク・レス
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Socket.IOをコネクト
io.on('connection', function(socket){
  console.log('a user connected');
  // メッセージ処理
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

// ポートを3000番
http.listen(3000, function(){
  console.log('listening on *:3000');
});