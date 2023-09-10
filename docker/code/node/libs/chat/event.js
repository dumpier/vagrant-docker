const ChatEvent = {
    instance() { return Object.create(ChatEvent); },

    handle(io, socket, storage){
        this.onConnect(io, socket, storage);
        this.onJoin(io, socket, storage);
        this.onMessage(io, socket, storage);
        this.onDisconnect(io, socket, storage);
    },

    onConnect(io, socket, storage){
        console.log(`A user(${socket.id}) connected.`);
        if (!storage.users.includes(socket.id)) {
            storage.users.push(socket.id);
            io.emit('chat user', storage.users);
        }

        if (storage.msgs.length) {
          io.to(socket.id).emit('chat message', storage.msgs);
        }
    },

    onJoin(io, socket, storage){
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
        socket.on('chat message', (msg)=>{
            console.log('# Message', msg);
            const chat = { id: socket.id, msg:msg, time:new Date().toLocaleString('sv'), };

            storage.msgs.push(chat);
            io.emit('chat message', chat);
        });
    },

    onDisconnect(io, socket, storage){
        socket.on("disconnect",()=>{
            console.log("A user(${socket.id}) disconnect.");
            storage.users = storage.users.filter((user)=>{ return user!=socket.id });
            io.emit('chat user', storage.users);
        });
    },
}

module.exports = ChatEvent;