const ChatEvent = {
  io: null, socket: null, storage: null,

  instance(io, socket, storage) {
    const obj = Object.create(ChatEvent);
    [this.io, this.socket, this.storage] = [io, socket, storage];
    return obj;
  },

  handle(){
    this.onConnect();
    this.onJoin();
    this.onMessage();
    this.onDisconnect();
  },

  onConnect(){
    let [io, socket, storage, roomid, userid] = this.parameter();
    console.log(`A user(${userid}) connected room #${roomid}.`);
    if (!storage.users(roomid).includes(userid)) {
      console.log("storage", storage.data);
      storage.addUser(roomid, userid);
      console.log("storage", storage.data);
      io.emit('chat user', storage.users(roomid));
    }

    // 過去のメッセージを全部送る
    if (storage.msgs(roomid).length) {
      io.to(userid).emit('chat message', storage.msgs(roomid));
    }
  },

  onJoin(){
    let [io, socket, storage, roomid, userid] = this.parameter();
    socket.on('join', (data)=>{
      console.log(`${userid} join #${data.roomid}, leave #${roomid}`, data, storage.data.rooms[1], storage.data.rooms[2], storage.data.rooms[3], storage.data.rooms[4], storage.data.rooms[5]);
      // ユーザー一覧の更新
      storage.addUser(data.roomid, userid);
      // 退室したルームのユーザー一覧を更新
      io.emit('chat user', storage.users(roomid));
      // 入室したルームのユーザー一覧を更新
      io.emit('chat user', storage.users(data.roomid));
      socket.join(data.roomid);
    });
  },

  onMessage(){
    let [io, socket, storage, roomid, userid] = this.parameter();
    socket.on('chat message', (msg)=>{
      console.log('# Message', msg);
      const data = storage.addMsg(roomid, userid, msg);
      console.log("chat data", data);
      io.emit('chat message', data);
    });
  },

  onDisconnect(){
    let [io, socket, storage, roomid, userid] = this.parameter();
    socket.on("disconnect",()=>{
      console.log(`A user(${userid}) disconnect.`);
      storage.users(roomid, storage.users(roomid).filter((user)=>{ return user!=userid; }));
      io.emit('chat user', storage.users(roomid));
    });
  },

  parameter() {
    return [
      this.io,
      this.socket,
      this.storage,
      this.storage.roomid(this.socket.id),
      this.socket.id,
    ];
  },
}

module.exports = ChatEvent;