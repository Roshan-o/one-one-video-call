import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
const app = express();



const PORT = 3000;

const server = http.createServer(app);
const io = new Server(server,{
  cors: true,
});

const emailtosockeid=new Map();
const sockeidtoemail=new Map();


io.on('connection', (socket) => {
    console.log('a user connected',socket.id);
    socket.on('join-room',({email,roomid})=>{
      // console.log('join-room at backend',email,roomid)
      emailtosockeid.set(email,socket.id);
      sockeidtoemail.set(socket.id,email);
      io.to(roomid).emit('user-joined',{email,id:socket.id});
      socket.join(roomid);
      io.to(socket.id).emit('joined-room',{email,roomid});
      // console.log(email,roomid)
    })


    socket.on('user-call',({to,offer})=>{
      io.to(to).emit('incoming-call',{from:socket.id,offer:offer});
    });
    
    socket.on('call-accepted-send-back',({to,ans})=>{
      console.log("at Backend:",to,ans);
      io.to(to).emit('call-accepted-send-back',{from:socket.id,ans});
      
    });

    socket.on('peer-nego-needed',({to,offer})=>{
      io.to(to).emit('peer-nego-needed',{from:socket.id,offer});
    })

    socket.on('peer-nego-done',({to,ans})=>{
      // console.log('before:sending-nego',ans);
      io.to(to).emit('peer-nego-final',{from:socket.id,ans});
    });


});

app.get('/', (req, res) => {
  res.send('Socket.IO Server Running');
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});