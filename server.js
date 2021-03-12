const app = require('express')();
const path = require('path')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser')
const KVSTORE = { "apple": [], "banana": [], "pear": []}
app.use(bodyParser.json())
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
})
app.get('/r/:dirName', function (req, res) {
  const dirName = req.params.dirName
  if (KVSTORE[dirName] !== undefined) {
    const requests = {dirName, requests: KVSTORE[dirName]}
    io.emit('requests', requests)
  }
});

app.post('/r/:dirName', function (req, res) {
    const dirName = req.params.dirName
    const dir = KVSTORE[req.params.dirName]
  if (KVSTORE[req.params.dirName] !== undefined) {
    const { method, headers, body } = req
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const request = {method, ip, headers, body}
    dir.push(request)

    io.emit('newRequest', { dirName, request })
    
    console.log(dir)
    res.status(200).send(`You made a request from: ${ip}`)
  }
  res.status(404).end()
})

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

  socket.on('find_dir', function ({ dirName }) {
    console.log(dirName)
    if (KVSTORE[dirName]) {
      socket.dirName = dirName

      socket.emit('requests', {dirName, requests: KVSTORE[dirName]})
    }
  });

   //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

http.listen(5000, function() {
   console.log('listening on *:5000');
});