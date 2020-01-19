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

    // 소켓 객체에 클라이언트 Host, Port 정보 속성으로 추가
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;

    socket.on('message', (message) => {
        console.log('이벤트를 받았습니다.');
        console.dir(message);

        if (message.recepient == 'ALL') {

            // 나를 포함한 모든 클라이언트에게 메세지 전달
            io.sockets.emit('message', message);
        }
    });
});