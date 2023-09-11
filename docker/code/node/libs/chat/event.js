const ChatEvent = {
    instance() { return Object.create(ChatEvent); },
    handle(io, socket, storage){
        this.onConnect(io, socket, storage);
        this.onJoin(io, socket, storage);
        this.onMessage(io, socket, storage);
        this.onDisconnect(io, socket, storage);
    },

    onConnect(io, socket, storage){
        const [roomid, userid] = [1, socket.id];
        console.log(`A user(${userid}) connected room #${roomid}.`);
        if (!storage.users(roomid).includes(userid)) {
            storage.addUser(roomid, userid);
            io.emit('chat user', storage.users(roomid));
        }

        if (storage.msgs(roomid).length) {
          io.to(userid).emit('chat message', storage.msgs(roomid));
        }
    },

    onJoin(io, socket, storage){
        const [roomid, userid] = [1, socket.id];
        socket.on('join', (data)=>{
            usrobj = {
              'room': msg.roomid,
              'name': msg.name
            };
            store[data.id] = usrobj;
            socket.join(data.roomid);
        });
    },

    onMessage(io, socket, storage){
        const [roomid, userid] = [1, socket.id];
        socket.on('chat message', (msg)=>{
            console.log('# Message', msg);
            const data = storage.addMsg(roomid, userid, msg);
            console.log("chat data", data);
            io.emit('chat message', data);
        });
    },

    onDisconnect(io, socket, storage){
        const [roomid, userid] = [1, socket.id];
        socket.on("disconnect",()=>{
            console.log("A user(${userid}) disconnect.");
            storage.users(roomid, storage.users(roomid).filter((user)=>{ return user!=userid; }));
            io.emit('chat user', storage.users(roomid));
        });
    },
}

module.exports = ChatEvent;