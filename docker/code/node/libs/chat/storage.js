const ChatStorage = {
    rooms:{},
    msgs:{},

    instance(){
        const obj = Object.create(ChatStorage);
        [1,2,3,4,5].forEach((roomid)=>{ obj.rooms[roomid] = Room.instance(roomid); });
        return obj;
    },

    getRoom(roomid){ return this.rooms[roomid]; },

    getUsers(roomid){ return this.getRoom(roomid).users; },
    addUser(roomid, userid){
        // 他のroomから削除
        Object.keys(this.rooms).forEach((room)=>{ room.users.filter((user)=>{ return user!=userid }); });
        // 指定roomに追加
        this.rooms[roomid].users.push(userid);

        return this;
    },

    getMessages(roomid){ return this.getRoom(roomid).msgs; },
    addMessage(roomid, userid, msg){
        const obj = Message.instance(roomid, userid, msg);
        this.getRoom(roomid).push(obj);
        return this;
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
        obj.roomid = roomid;
        obj.userid = userid;
        obj.msg = msg;
        obj.time = new Date().toLocaleString('sv');
        return obj;
    },
}

module.exports = ChatStorage;