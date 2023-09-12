const ChatStorage = {
  instance(){
    const obj = Object.create(ChatStorage);
    // 最初から５つのルームを用意
    [1,2,3,4,5].forEach((i)=>{ Data.rooms[i] = Room.instance(i); });
    return obj;
  },
}

ChatStorage.user = {
  roomid(userid) {
    console.log("[USERS]", Data.users);
    const roomid = Data.users[userid] ?? 1;
    console.log("[USERS]", roomid, Data.users);
    return roomid;
  },
  has(userid, roomid){ return this.roomid(userid)==roomid; },
  all(roomid){ return Object.keys(Data.rooms[roomid].users); },
  add(userid, roomid){ return this.change(userid, roomid ?? 1); },
  leave(userid){
    const roomid = this.roomid();
    delete Data.users[userid];
    delete Data.rooms[roomid].users[userid]
    return this;
  },
  enter(userid, roomid){ return this.change(userid, roomid); },
  change(userid, roomid){
    const roomid_old = Data.users[userid];
    if (roomid_old) {
      delete Data.rooms[roomid_old].users[userid];
    }
    Data.users[userid] = roomid;
    Data.rooms[roomid].users[userid] = 1;
    return this;
  },
}

ChatStorage.message = {
  all(roomid){ return Data.rooms[roomid].msgs; },
  add(roomid, userid, msg){ const obj = Message.instance(roomid, userid, msg); Data.rooms[roomid].msgs.push(obj); return obj; },
}

const Data = {
  rooms: {},
  users: {},
}

const Room = {
  id: 1, msgs: [], users: {},
  instance(id){ const obj = Object.create(Room); obj.id = id; return obj; },
}

const Message = {
  roomid: 1, userid: "", msg:"", time:null,
  instance(roomid, userid, msg){ const obj = Object.create(Message); [obj.roomid, obj.userid, obj.msg, obj.time] = [roomid, userid, msg, new Date().toLocaleString('sv')]; return obj; },
}

module.exports = ChatStorage;