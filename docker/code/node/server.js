const express = require('express');
const app = express();
const http = require('http').Server(app);

// ディレクトリ定義
var dir = dir || {
  root(sub){ sub=sub??""; return `${__dirname}/${sub}`; },
  public(sub){ sub=sub??""; return this.root(`public/${sub}`); },
  libs(sub){ sub=sub??""; return this.root(`libs/${sub}`); },
  views(sub){ sub=sub??""; return this.root(`views/${sub}`); },
  routes(sub){ sub=sub??""; return this.root(`routes/${sub}`); },
};

// ルーティング処理
require("./libs/router").instance().dispatch(express, app, dir);


// チャット関連(socket.io)
const io = require('socket.io')(http);
const storage = require('./libs/chat/storage').instance();
io.on('connection', (socket)=>{
  require('./libs/chat/event').instance(io, socket, storage).handle();
});


http.listen(3000, ()=>{ console.log('listening on *:3000'); });