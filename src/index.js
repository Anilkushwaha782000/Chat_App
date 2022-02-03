const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter=require('bad-words')
const{generatemsg,generatelocationmsg}=require('../src/utils/message')
const{getUser,removeUser,getUserInRoom,addUser}=require('../src/utils/user')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../src/public')

app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('New WebSocket connection')
   

    socket.on('join',(options,callback)=>{
       const{error,user}= addUser({id:socket.id,...options})
       if(error){
        return callback(error)
       }
     socket.join(user.room)
     socket.emit('message',generatemsg('Admin','Welcome'))

     socket.broadcast.to(user.room).emit('message',generatemsg('Admin',`${user.username} has joined the chat`))

     io.to(user.room).emit('roomData',{
         room:user.room,
         users:getUserInRoom(user.room)
     })
     callback()
    })
    socket.on('sendMessage',(message,callback)=>{
        const user=getUser(socket.id)

    const filter=new Filter()
    if(filter.isProfane(message)){
        return callback('Profanity is not allowed!')
    }
    io.to(user.room).emit('message',generatemsg(user.username,message))
    callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        const user=getUser(socket.id)
       io.to(user.room).emit('locationmsg',generatelocationmsg(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
       callback()
    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generatemsg('Admin',`${user.username}  has left the meeting!`))
            io.to(user.room).emit('roomData',{
               room:user.room,
               users:getUserInRoom(user.room) 
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})