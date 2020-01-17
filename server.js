var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var static = require('serve-static');
var socketio = require('socket.io');
var cors = require('cors');
var session = require('express-session');

//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('/views', static(path.join(__dirname, 'views')));

var mainRouter = require('./router/routes');

app.use(mainRouter);

var server = app.listen(3000, '192.168.0.40', () => {
    console.log('http://192.168.0.40:3000');
});

var io = socketio.listen(server);

io.sockets.on('connection', (socket) => {
    console.log('Connect to Socket: ', socket.request.connection._peername);
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;

    socket.on('message', (message) => {
        console.log('이벤트를 받았습니다.');
        console.dir(message);

        if (message.recepient == 'ALL') {
            io.sockets.emit('message', message);
        }
    });

    socket.on('room', (room) => {
        console.log('방 생성 이벤트를 받았습니다.');
        console.dir(room);
        console.log(session)
        if (room.command == 'create') {
            if (io.sockets.adapter.rooms[room.roomId]) {
                console.log('방이 이미 만들어져 있습니다. ');
            } else {
                console.log('방을 새로 만듭니다. ');

                socket.join(room.roomId);

                var curRoom = io.sockets.adapter.rooms[room.roomId];
                console.log('curRoom', curRoom);
            }
        }
    });
});