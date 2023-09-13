global.express = require('express');
global.app = express();
global.http = require('http').Server(app);

// エラーハンドリング
process.on('uncaughtException', (err)=>{ console.log(err); });

// フォルダ定義
global.dir = require("./config/directory").instance(__dirname);

// ルーティング処理
require("./libs/routing").instance().dispatch();
http.listen(3000, ()=>{ console.log('listening on *:3000'); });

// チャット関連(socket.io)
require('./libs/chat/event');
