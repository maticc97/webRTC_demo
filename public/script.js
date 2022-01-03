const socket = io ('/')

socket.emit('join-room', ROOM_ID, 10) //sends join-room to server side socket.io

socket.on('user-connected', (roomId, socketCount) => {
    console.log("Another user connected to Room ID " +  roomId)
    console.log("Currently connected " + socketCount + 'users')
})
