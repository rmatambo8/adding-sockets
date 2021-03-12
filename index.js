const express = require('express')
const app = express();
const path = require('path')
const http = require('http').Server(app)
const io = require('socket.io')(http)
app.use(express.json())
const sockets = []

io.on('connection', function(socket) {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('a user has disconnected');
  })
});

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => console.log(`Listening on port ${3000}`));