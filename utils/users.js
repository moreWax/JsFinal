// state
const users = [];

// Join user to chat
// adds user properties on to the array
function buildUser(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  // filter for user with matching user id that's passed into this function
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  // checks for the users index in the array
  const index = users.findIndex(user => user.id === id);

  // checks to make sure the index isn't -1 (Our setinal value)
  if (index !== -1){
    return users.splice(index, 1)[0];
  }
  return users.splice(index, 1);
}

// Get room users | 
// For each user we want to return the users in that are currently in the room.
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

// export this module to use in server.js
module.exports = {
  buildUser,
  getCurrentUser,
  userLeave,
  getRoomUsers
};