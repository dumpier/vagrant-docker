const ChatStorage = {
    users:{},
    rooms:{},
    msgs:{},

    instance(){
        const obj = Object.create(ChatStorage);
        [1,2,3,4,5].forEach((roomid)=>{ obj.rooms[roomid] = Room.instance(roomid); });
        return obj;
    },

    getRoom(roomid){ return this.rooms[roomid]; },

    getUsers(roomid){ return this },
    addUser(roomid, userid){},

    getMessages(roomid){ return this },
    addMessage(roomid, userid, msg){},
}

const Room = {
    id:0,
    msgs:[],
    users:[],
    instance(roomid){
        const obj = Object.create(Room);
        obj.id = roomid;
        return obj;
    },
}

const User = {
    id:0,
    roomid:0,
    msgs:[],
    instance(userid, roomid){
        const obj = Object.create(User);
        obj.roomid = roomid;
        return obj;
    },
}

const Message = {
    roomid:0,
    userid:0,
    msg:"",
    time:null,
    instance(roomid, userid, msg){
        const obj = Object.create(Message);
        obj.roomid = roomid;
        obj.roomid = userid;
        obj.roomid = msg;
        obj.time = new Date().toLocaleString('sv');
        return obj;
    },
}

module.exports = ChatStorage;