const socket = io ('/')
const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

const myVideo = document.createElement('video')
//we mute our video, so we do not get echo effect
myVideo.muted = true
const peers = { }
//WebRTC API call to get local camera view
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then (stream => {
    a = document.createElement('div')
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    //we need to allow ourselfs to connect to other users
    //when server response "user-connected is received"
    socket.on('user-connected', (userId) => {
        console.log("Sobi "+ ROOM_ID + " se je pridružil Peer " + userId)
        setTimeout(connectToNewUser,1000,userId,stream)
    })
})

socket.on('user-disconnected', userId => {
    peers[userId].close()
})

//on open peer, emit to server "join-room" //   id is automaticlly generated
myPeer.on('open', id => {
    console.log("V sobo " + ROOM_ID + " se povezuje PEER z ID: " + id  )
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream){
    //call function - calls user with current ID
    console.log("Pošiljam video uporabniku " + userId)
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    //when other users call us back, we get event 'stream'
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
        console.log("Prejemam video od uporabnika " + userId)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

//adding local video stream to webpage (selfview)
function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}