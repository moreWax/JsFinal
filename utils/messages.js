const moment = require('moment');

function structureMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = structureMessage;