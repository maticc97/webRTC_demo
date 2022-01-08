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
    socket.on('join-room', (roomId, userId) => { //client-side pošlje join-room
        console.log("Povezavo je vzpostavil Peer ID: " + userId)
        socket.join(roomId) //current socket join a room
        console.log(userId + "se pridružuje sobi " + roomId + "\n")
        
        var room_clients = io.of("/").adapter.sids;

        console.log("Obvestilo o novem članu poslano WebSocketom: \n",  io.of("/").adapter.sids)

        socket.broadcast.to(roomId).emit('user-connected', userId) //send massage to a room - BCAST (bomo poslali video)        
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(3000)
