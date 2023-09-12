const ChatStorage = {
  data:{ rooms: {}, users: {}, },

  instance(){
    const obj = Object.assign({}, this);
    [obj.user, obj.message, ].forEach((p)=>{Object.assign(p,obj);});
    // 最初から５つのルームを用意
    [1,2,3,4,5].forEach((i)=>{ obj.data.rooms[i] = Room.instance(i); });
    return obj;
  },

  rooms(roomid){ return roomid==undefined ? this.data.rooms : this.data.rooms[roomid]; },
}

ChatStorage.user = {
  roomid(userid) { return this.data.users[userid] ?? 1; },
  has(userid, roomid){ return this.roomid(userid)==roomid; },
  all(roomid){ return Object.keys(this.rooms(roomid).users); },
  // TODO 他のルームに入ってないかのチェック等
  set(roomid, users){ this.data.users = users; return this; },
  add(userid, roomid){ return this.change(userid, roomid ?? 1); },
  leave(userid){
    const roomid = this.roomid();
    delete this.data.users[userid];
    delete this.data.rooms[roomid].users[userid]
    return this;
  },
  change(userid, roomid){
    const roomid_old = this.data.users[userid];
    if (roomid_old) {
      delete this.data.rooms[roomid_old].users[userid];
    }
    this.data.users[userid] = roomid;
    this.data.rooms[roomid].users[userid] = 1;
    return this;
  },
}

ChatStorage.message = {
  all(roomid){ return this.data.rooms[roomid].msgs; },
  add(roomid, userid, msg){ const obj = Message.instance(roomid, userid, msg); this.rooms(roomid).msgs.push(obj); return obj; },
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