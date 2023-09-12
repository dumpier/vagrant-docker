const io = require('socket.io')(http);
const storage = require('./storage').instance();

io.on('connection', (socket)=>{ ChatEvent.handle(io, socket, storage); });

const ChatEvent = {
  handle(io, socket, storage){
    this.onConnect(io, socket, storage);
    this.onMessage(io, socket, storage);
    this.onJoin(io, socket, storage);
    this.onDisconnect(io, socket, storage);
  },

  onConnect(io, socket, storage){
    const [userid, roomid] = [socket.id, storage.user.roomid(socket.id)];
    console.log(`# a user connected. [roomid:${roomid}][userid:${userid}]`);

    storage.user.add(userid, roomid);
    io.to(roomid).emit('chat user', storage.user.all(roomid));
    // 新入には過去の全メッセージを送る
    io.to(userid).emit('chat message', storage.message.all(roomid));
  },

  onMessage(io, socket, storage){
    socket.on('chat message', (msg)=>{
      const [userid, roomid] = [socket.id, storage.user.roomid(socket.id)];
      console.log(`# message[userid:${userid}][roomid:${roomid}]`, msg);

      const data = storage.message.add(roomid, userid, msg);
      io.to(roomid).emit('chat message', data);
    });
  },

  onJoin(io, socket, storage){
    socket.on('join', (data)=>{
      const [userid, roomid] = [socket.id, storage.user.roomid(socket.id)];
      console.log(`# ${userid} join. [enter:${data.roomid}][leave:${roomid}]`);

      socket.join(data.roomid);
      storage.user.change(userid, data.roomid);
      io.to(data.roomid).emit('chat user', storage.user.all(data.roomid));
      io.to(userid).emit('chat message', storage.message.all(data.roomid));

      if (roomid != data.roomid) {
        // 退室したルームのユーザー一覧を更新
        socket.leave(roomid);
        io.to(roomid).emit('chat user', storage.user.all(roomid));
      }
    });
  },

  onDisconnect(io, socket, storage){
    socket.on("disconnect",()=>{
      const [userid, roomid] = [socket.id, storage.user.roomid(socket.id)];
      console.log(`# a user disconnected. [roomid:${storage.user.roomid(userid)}][userid:${userid}]`);

      socket.leave(roomid);
      storage.user.leave(userid);
      io.to(roomid).emit('chat user', storage.user.all(roomid));
    });
  },
}

module.exports = ChatEvent;