// models/User.js - User model
class User {
  constructor(id, username, socketId) {
    this.id = id;
    this.username = username;
    this.socketId = socketId;
    this.online = true;
    this.lastSeen = new Date();
    this.currentRoom = "general";
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      online: this.online,
      lastSeen: this.lastSeen,
      currentRoom: this.currentRoom,
    };
  }
}

module.exports = User;
