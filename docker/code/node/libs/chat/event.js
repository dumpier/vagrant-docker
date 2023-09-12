const io = require('socket.io')(http);
const storage = require('./storage').instance();

io.on('connection', (socket)=>{ ChatEvent.instance(socket).handle(); });

const ChatEvent = {
  ref:{ socket: null, },
  instance(socket) { const obj=Object.create(ChatEvent); [obj.ref.socket]=[socket]; return obj; },
  handle(){
    this.onConnect();
    this.onJoin();
    this.onMessage();
    this.onDisconnect();
  },

  onConnect(){
    let [socket, roomid, userid] = this.parameter();
    console.log(`# a user connected. [roomid:${roomid}][userid:${userid}]`);

    storage.user.add(userid, roomid);
    // io.emit('chat user', storage.user.all(roomid));
    io.to(roomid).emit('join', storage.user.all(roomid));
    io.to(roomid).emit('chat user', storage.user.all(roomid));

    // 過去のメッセージを全部送る
    io.to(userid).emit('chat message', storage.message.all(roomid));
  },

  onJoin(){
    let [socket, roomid, userid] = this.parameter();

    socket.on('join', (data)=>{
      console.log(`# ${userid} join. [roomid:#${data.roomid}, leave #${roomid}`);

      // 部屋変更処理
      storage.user.change(userid, data.roomid);
      // io.to(data.roomid).emit('chat user', storage.user.all(data.roomid));
      socket.join(data.roomid);
      io.sockets.in(data.roomid).emit('chat user', storage.user.all(data.roomid));

      if (roomid != data.roomid) {
        // 退室したルームのユーザー一覧を更新
        // io.to(roomid).emit('chat user', storage.user.all(roomid));
        socket.leave(roomid);
        io.sockets.in(data.roomid).emit('chat user', storage.user.all(roomid));
      }
    });
  },

  onMessage(){
    let [socket, roomid, userid] = this.parameter();

    socket.on('chat message', (msg)=>{
      console.log('# message', msg);
      const data = storage.message.add(roomid, userid, msg);
      io.to(roomid).emit('chat message', data);
    });
  },

  onDisconnect(){
    let [socket, roomid, userid] = this.parameter();

    socket.on("disconnect",()=>{
      console.log(`# a user disconnected. [roomid:${storage.user.roomid(userid)}][userid:${userid}]`);
      storage.user.leave(userid);
      io.to(roomid).emit('chat user', storage.user.all(roomid));
    });
  },

  parameter() {
    return [
      this.ref.socket,
      storage.user.roomid(this.ref.socket.id),
      this.ref.socket.id,
    ];
  },
}

module.exports = ChatEvent;