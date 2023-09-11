const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// ディレクトリ定義
const dir = {
  root(sub){ sub=sub??""; return `${__dirname}/${sub}`; },
  libs(sub){ sub=sub??""; return this.root(`libs/${sub}`); },
  views(sub){ sub=sub??""; return this.views(`libs/${sub}`); },
  routes(sub){ sub=sub??""; return this.root(`routes/${sub}`); },
};

// ルーティング処理
require("./libs/router").instance().dispatch(express, app, dir);


// チャット関連(socket.io)
const storage = require('./libs/chat/storage').instance();
io.on('connection', (socket)=>{
  require('./libs/chat/event').instance().handle(io, socket, storage);
});


http.listen(3000, ()=>{ console.log('listening on *:3000'); });