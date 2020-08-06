const jsonServer = require('json-server')
// return an express server
const server = jsonServer.create();
// set default middlewares(logger, static, cors and no-cache)
const middlewares = jsonServer.defaults()
// returns an express router
const router = jsonServer.router('db.json')

server.use(middlewares);

server.use('/jsondb', router);

const http = require('http').createServer(server);

const axios = require('axios');
server.get('/db', function (req, res) { 
    res.sendFile(__dirname + '/index.html');

    axios.post('http://localhost:3000/jsondb/users', {
        userName: "Weng"
    })
    .then((res) => console.log(res.data))
})

// initialize a new instance of socket.io by passing the http (the HTTP server) object.
const io = require('socket.io')(http);
// 所有連上這個 socket server 的 client
let users = [];
io.on('connection', (socket) => {
    socket.emit('transferId', socket.id)

    // 新增在線人數
    socket.on('login', (user) => {
        users.push(user);
        io.emit('updateUser', users);
        console.log(users);
    })

    // 由發出邀請的人創建房間後加入
    socket.on('createOrJoinRoom', (roomInfo) => {
        socket.join(roomInfo.roomName, () => {
            let room = Object.keys(socket.rooms);
            console.log(room);
            socket.to(roomInfo.invited).emit('inviteMsg', {
                creator: roomInfo.creator,
                roomName: roomInfo.roomName
            })
        })
    })

    // 更改使用者目前狀態（有空或沒空）
    socket.on('changeStatus', (user) => {
        let targetIndex = users.findIndex((u) => u.id === user.id);
        if(targetIndex === -1) return;
        users[targetIndex].status = user.status;
        io.emit('updateUser', users);
    })
    
    socket.on('joined', (user) => {
        console.log(user);
        socket.to(user.roomName).emit('sendInfo', {
            type: 'info',
            author: '',
            content: `${user.name} has joined the room!`
        });
    })

    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
    })

    socket.on('addMessage', (req) => {
        socket.to(req.room).emit('addMessage', req.msg);
    })

    socket.on('type', (data) => {
        if(data.typing) {
            socket.broadcast.emit('toggleHint', {
                content: `${data.author} is typing ...`
            })
        } else {
            socket.broadcast.emit('toggleHint', {
                content: ''
            })
        }
        
    })

    socket.on('leaveRoom', (user) => {
        socket.to(user.roomName).emit('sendInfo', {
            type: 'info',
            author: '',
            content: `${user.userName} has left the room!`
        })
    })

    socket.on('logout', (user) => {
        let targetIndex = users.findIndex((u) => u.id === user.id);
        users.splice(targetIndex, 1);
        io.emit('updateUser', users); 
    })

    socket.on('disconnect', (reason) => {
        console.log('disconnect reason', reason);
    })
});

http.listen(3000 , () => {
  console.log('JSON Server is running')
})