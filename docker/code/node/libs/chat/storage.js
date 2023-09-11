const ChatStorage = {
  data:{ rooms:{} },

  instance(){
    const obj = Object.create(ChatStorage);
    // 最初から５つのルームを用意
    [1,2,3,4,5].forEach((i)=>{ obj.data.rooms[i] = Room.instance(i); });
    return obj;
  },

  rooms(roomid){ return roomid==undefined ? this.data.rooms : this.data.rooms[roomid]; },

  // 指定ユーザーのroomidを取得
  roomid(userid) {
    let roomid = 1;
    for(const i in this.rooms()) {
      if (this.rooms(i).users.includes(userid)) {
        roomid = i;
        break;
      }
    }
    return roomid;
  },

  users(roomid, users){
    if (users==undefined) { return this.rooms(roomid).users; }
    this.rooms(roomid).users = users;
    return this;
  },

  addUser(roomid, userid){
    // 他のroomから削除
    const rooms = this.rooms();
    for(const i in this.rooms()) {
      this.data.rooms[i].users = this.rooms(i).users.filter((user)=>{ return user!=userid });
    }
    // 指定roomに追加
    this.rooms(roomid).users.push(userid);
    return this;
  },

  msgs(roomid){ return this.rooms(roomid).msgs; },
  addMsg(roomid, userid, msg){
    const obj = Message.instance(roomid, userid, msg);
    this.rooms(roomid).msgs.push(obj);
    return obj;
  },
}

const Room = {
  id: 1,
  msgs: [],
  users: [],
  instance(id){
    const obj = Object.create(Room);
    obj.id = id;
    return obj;
  },
}

const Message = {
  roomid: 1,
  userid: "",
  msg:"",
  time:null,
  instance(roomid, userid, msg){
    const obj = Object.create(Message);
    [obj.roomid, obj.userid, obj.msg, obj.time] = [roomid, userid, msg, new Date().toLocaleString('sv')];
    return obj;
  },
}

module.exports = ChatStorage;