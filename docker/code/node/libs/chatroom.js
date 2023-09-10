"use strict";

const ChatRoom = {
    instance() {
        return Object.create(ChatRoom);
    },

    handle(io, socket, data){
        this.onConnect(io, socket, data);
        this.onMessage(io, socket, data);
        this.onDisconnect(io, socket, data);
    },

    onConnect(io, socket, data){
        console.log(`A user(${socket.id}) connected.`);
        if (!data.users.includes(socket.id)) {
          data.users.push(socket.id);
          io.emit('chat user', data.users);
        }

        if (data.msgs.length) {
          io.to(socket.id).emit('chat message', data.msgs);
        }
    },

    onMessage(io, socket, data){
        socket.on('chat message', function(msg){
            console.log('# Message', msg);
            const chat = { id: socket.id, msg:msg, time:new Date().toLocaleString('sv'), };

            data.msgs.push(chat);
            io.emit('chat message', chat);
        });
    },

    onDisconnect(io, socket, data){
        socket.on("disconnect",()=>{
            console.log("A user(${socket.id}) disconnect.");
            data.users = data.users.filter((user)=>{ return user!=socket.id });
            io.emit('chat user', data.users);
        });
    },
}

module.exports = ChatRoom;