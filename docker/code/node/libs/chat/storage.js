const ChatStorage = {
    data:{rooms:{}},
    instance(){
        const obj = Object.create(ChatStorage);
        // 最初から５つのルームを用意
        [1,2,3,4,5].forEach((roomid)=>{ obj.data.rooms[roomid] = Room.instance(roomid); });
        return obj;
    },

    rooms(roomid){ return roomid==undefined ? this.data.rooms : this.data.rooms[roomid]; },
    room(roomid){ return this.rooms(roomid); },

    users(roomid, users){
        if (users==undefined) { return this.room(roomid).users; }
        this.room(roomid).users = users;
        return this;
    },
    addUser(roomid, userid){
        // 他のroomから削除
        const rooms = this.rooms();
        Object.keys(rooms).forEach((id)=>{ rooms[id].users.filter((user)=>{ return user!=userid });
        });
        // 指定roomに追加
        this.room(roomid).users.push(userid);
        return this;
    },

    msgs(roomid){ return this.room(roomid).msgs; },
    addMsg(roomid, userid, msg){
        const obj = Message.instance(roomid, userid, msg);
        this.room(roomid).msgs.push(obj);
        return obj;
    },
}

const Room = {
    id: 1,
    msgs: [],
    users: [],
    instance(roomid){
        const obj = Object.create(Room);
        obj.id = roomid;
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