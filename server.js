const express = require('express')
const { Socket } = require('socket.io')
const app = express()
const server = require('http').Server(app) //server can be used with socket.io
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/',(req,res)=> {
 res.redirect(`/${uuidv4()}`) //response redirect 
})

app.get('/:room',(req,res) => {
    res.render('room', {roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId) => { //client-side pošlje join-room
        socket.join(roomId) //current socket join a room
        console.log("   ")
        socketCount = io.of('/').sockets.size;
        console.log(socketCount)
        socket.broadcast.to(roomId).emit('user-connected', roomId, socketCount) //send massage to a room - BCAST (bomo poslali video)
 
        
    })
})

server.listen(3000)
