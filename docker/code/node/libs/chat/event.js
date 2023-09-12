const io = require('socket.io')(http);
const storage = require('./storage').instance();

io.on('connection', (socket)=>{ ChatEvent.instance(socket).handle(); });

const ChatEvent = {
  ref:{ socket: null, },
  instance(socket) { const obj=Object.create(ChatEvent); [obj.ref.socket]=[socket]; return obj; },
  handle(){
    this.onConnect();
    this.onMessage();
    this.onJoin();
    this.onDisconnect();
  },

  onConnect(){
    let [userid, roomid] = this.parameter();
    console.log(`# a user connected. [roomid:${roomid}][userid:${userid}]`);

    storage.user.add(userid, roomid);
    io.to(roomid).emit('chat user', storage.user.all(roomid));
    // 新入には過去の全メッセージを送る
    io.to(userid).emit('chat message', storage.message.all(roomid));
  },

  onMessage(){
    const socket = this.ref.socket;

    socket.on('chat message', (msg)=>{
      let [userid, roomid] = this.parameter();

      console.log('# message', msg);
      const data = storage.message.add(roomid, userid, msg);
      io.to(roomid).emit('chat message', data);
    });
  },

  onJoin(){
    const socket = this.ref.socket;

    socket.on('join', (data)=>{
      let [userid, roomid] = this.parameter();

      console.log(`# ${userid} join. [enter:${data.roomid}][leave:${roomid}]`);

      storage.user.change(userid, data.roomid);
      socket.join(data.roomid);
      io.to(data.roomid).emit('chat user', storage.user.all(data.roomid));
      io.to(userid).emit('chat message', storage.message.all(data.roomid));

      if (roomid != data.roomid) {
        // 退室したルームのユーザー一覧を更新
        socket.leave(roomid);
        io.to(roomid).emit('chat user', storage.user.all(roomid));
      }
    });
  },

  onDisconnect(){
    const socket = this.ref.socket;

    socket.on("disconnect",()=>{
      let [userid, roomid] = this.parameter();

      console.log(`# a user disconnected. [roomid:${storage.user.roomid(userid)}][userid:${userid}]`);
      storage.user.leave(userid);
      io.to(roomid).emit('chat user', storage.user.all(roomid));
    });
  },

  parameter() {
    const userid = this.ref.socket.id;
    return [userid, storage.user.roomid(userid),];
  },
}

module.exports = ChatEvent;