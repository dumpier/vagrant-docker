const io = require('socket.io')(http);
const storage = require('./storage').instance();

io.on('connection', (socket)=>{
  ChatEvent.instance(socket).handle();
});


const ChatEvent = {
  ref:{ socket: null, },

  instance(socket) {
    const obj = Object.create(ChatEvent);
    [obj.ref.socket] = [socket];
    return obj;
  },

  handle(){
    this.onConnect();
    this.onJoin();
    this.onMessage();
    this.onDisconnect();
  },

  onConnect(){
    let [socket, roomid, userid] = this.parameter();

    console.log(`A user(${userid}) connected room #${roomid}.`);
    if (!storage.users(roomid).includes(userid)) {
      storage.addUser(roomid, userid);
      io.to(roomid).emit('chat user', storage.users(roomid));
    }

    // 過去のメッセージを全部送る
    if (storage.msgs(roomid).length) {
      io.to(userid).emit('chat message', storage.msgs(roomid));
    }
  },

  onJoin(){
    let [socket, roomid, userid] = this.parameter();

    socket.on('join', (data)=>{
      console.log(`${userid} join #${data.roomid}, leave #${roomid}`, data, storage.data);

      storage.addUser(data.roomid, userid); // ユーザー一覧の更新
      io.to(data.roomid).emit('chat user', storage.users(data.roomid)); // 入室したルームのユーザー一覧を更新
      socket.join(data.roomid);
      if (roomid != data.roomid) {
        io.to(roomid).emit('chat user', storage.users(roomid)); // 退室したルームのユーザー一覧を更新
        socket.leave(roomid);
      }
    });
  },

  onMessage(){
    let [socket, roomid, userid] = this.parameter();

    socket.on('chat message', (msg)=>{
      console.log('# Message', msg);
      const data = storage.addMsg(roomid, userid, msg);
      console.log("chat data", data);
      io.to(roomid).emit('chat message', data);
    });
  },

  onDisconnect(){
    let [socket, roomid, userid] = this.parameter();

    socket.on("disconnect",()=>{
      console.log(`A user(${userid}) disconnect.`);
      storage.users(roomid, storage.users(roomid).filter((user)=>{ return user!=userid; }));
      io.to(roomid).emit('chat user', storage.users(roomid));
    });
  },

  parameter() {
    return [
      this.ref.socket,
      storage.roomid(this.ref.socket.id),
      this.ref.socket.id,
    ];
  },
}

module.exports = ChatEvent;