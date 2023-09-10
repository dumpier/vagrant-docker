const ChatEvent = {
    instance() { return Object.create(ChatEvent); },

    handle(io, socket, rooms){
        this.onConnect(io, socket, rooms);
        this.onJoin(io, socket, rooms);
        this.onMessage(io, socket, rooms);
        this.onDisconnect(io, socket, rooms);
    },

    onConnect(io, socket, rooms){
        console.log(`A user(${socket.id}) connected.`);
        if (!rooms.users.includes(socket.id)) {
          rooms.users.push(socket.id);
          io.emit('chat user', rooms.users);
        }

        if (rooms.msgs.length) {
          io.to(socket.id).emit('chat message', rooms.msgs);
        }
    },

    onJoin(io, socket, rooms){
        socket.on('join', (data)=>{
            usrobj = {
              'room': msg.roomid,
              'name': msg.name
            };
            store[data.id] = usrobj;
            socket.join(data.roomid);
        });
    },

    onMessage(io, socket, rooms){
        socket.on('chat message', (msg)=>{
            console.log('# Message', msg);
            const chat = { id: socket.id, msg:msg, time:new Date().toLocaleString('sv'), };

            rooms.msgs.push(chat);
            io.emit('chat message', chat);
        });
    },

    onDisconnect(io, socket, rooms){
        socket.on("disconnect",()=>{
            console.log("A user(${socket.id}) disconnect.");
            rooms.users = rooms.users.filter((user)=>{ return user!=socket.id });
            io.emit('chat user', rooms.users);
        });
    },
}

module.exports = ChatEvent;