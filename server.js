var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var static = require('serve-static');
var socketio = require('socket.io');
var cors = require('cors');

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
    console.log('Connect to Socket: ', socket);
});