const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const structureMessage = require('./utils/messages');
const {
  buildUser,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const accountName = 'Admin';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    // userID
    const user = buildUser(socket.id,username, room);

    socket.join(user.room);

    // Welcome current user | Single User Client
    socket.emit('message', structureMessage(accountName, 'Welcome!'));

    // Broadcast message to the corrisponding room that matches userID
    // Doesn't Broadcast message to the actual user signing in
    socket.broadcast
    .to(user.room)
    .emit('message',
    structureMessage(accountName, `${user.username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

  });
  console.log('New WS Connection...');



  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    // By passing in our socket.id which will match the user with matching user id that's passed
    // into this function. 
    const user = getCurrentUser(socket.id);


    io.to(user.room).emit('message', structureMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    // if user leaves show this message.
    if (user){
      io.to(user.room).emit(
        'message', 
        structureMessage(accountName, `${user.username} has left the chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });
    }
  });


});


// Server Logging and Port Number
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));