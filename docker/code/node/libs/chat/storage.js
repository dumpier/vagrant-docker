const ChatStorage = {
  instance(){ Data.init(); return Object.create(ChatStorage); },
}

ChatStorage.user = {
  roomid(userid) { return Data.users[userid] ?? "1"; },
  all(roomid){ return Object.keys(Data.rooms[roomid].users); },
  add(userid, roomid){ return this.change(userid, roomid); },
  enter(userid, roomid){ return this.change(userid, roomid); },
  change(userid, roomid){
    const roomid_old = Data.users[userid];
    if (roomid_old) { delete Data.rooms[roomid_old].users[userid]; }
    Data.users[userid] = roomid;
    Data.rooms[roomid].users[userid] = 1;
    return this;
  },
  leave(userid){
    const roomid = this.roomid(userid);
    delete Data.users[userid];
    delete Data.rooms[roomid].users[userid];
    return this;
  },
}

ChatStorage.message = {
  all(roomid){ return Data.rooms[roomid].msgs; },
  add(roomid, userid, msg){
    const obj = Message.instance(roomid, userid, msg);
    Data.rooms[roomid].msgs.push(obj);
    return obj;
  },
}

const Data = {
  rooms: {},
  users: {},
  init(){ [1,2,3,4,5].forEach((i)=>{ this.rooms[i] = Room.instance(i); }); },
}

const Room = {
  id: null, msgs: null, users: null,
  instance(id){
    const obj = Object.create(Room);
    [obj.id, obj.msgs, obj.users] = [id, [], {}];
    return obj;
  },
}

const Message = {
  roomid: 1, userid: "", msg:"", time:null,
  instance(roomid, userid, msg){
    const obj = Object.create(Message);
    [obj.roomid, obj.userid, obj.msg, obj.time] = [roomid, userid, msg, new Date().toLocaleString('sv')];
    return obj;
  },
}

module.exports = ChatStorage;