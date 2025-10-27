// utils/storage.js - In-memory storage
const User = require("../models/User");
const Message = require("../models/Message");
const Room = require("../models/Room");

class Storage {
  constructor() {
    this.users = new Map(); // socketId -> User
    this.usersByUsername = new Map(); // username -> User
    this.rooms = new Map(); // roomName -> Room
    this.messages = []; // All messages
    this.typingUsers = new Map(); // socketId -> {username, room}

    // Create default room
    this.rooms.set("general", new Room("general", "system"));
  }

  // User methods
  addUser(user) {
    this.users.set(user.socketId, user);
    this.usersByUsername.set(user.username, user);
  }

  removeUser(socketId) {
    const user = this.users.get(socketId);
    if (user) {
      this.usersByUsername.delete(user.username);
      this.users.delete(socketId);
    }
    return user;
  }

  getUser(socketId) {
    return this.users.get(socketId);
  }

  getUserByUsername(username) {
    return this.usersByUsername.get(username);
  }

  getAllUsers() {
    return Array.from(this.users.values()).map((u) => u.toJSON());
  }

  updateUserRoom(socketId, roomName) {
    const user = this.users.get(socketId);
    if (user) {
      user.currentRoom = roomName;
    }
  }

  // Room methods
  createRoom(roomName, createdBy) {
    if (!this.rooms.has(roomName)) {
      const room = new Room(roomName, createdBy);
      this.rooms.set(roomName, room);
      return room;
    }
    return this.rooms.get(roomName);
  }

  getRoom(roomName) {
    return this.rooms.get(roomName);
  }

  getAllRooms() {
    return Array.from(this.rooms.values()).map((r) => r.toJSON());
  }

  addUserToRoom(socketId, roomName) {
    const user = this.users.get(socketId);
    const room = this.rooms.get(roomName);
    if (user && room) {
      room.addMember(user.id);
      user.currentRoom = roomName;
    }
  }

  removeUserFromRoom(socketId, roomName) {
    const user = this.users.get(socketId);
    const room = this.rooms.get(roomName);
    if (user && room) {
      room.removeMember(user.id);
    }
  }

  // Message methods
  addMessage(message) {
    this.messages.push(message);

    // Add to room if not private
    if (!message.isPrivate && message.room) {
      const room = this.rooms.get(message.room);
      if (room) {
        room.addMessage(message);
      }
    }

    // Keep only last 1000 messages globally
    if (this.messages.length > 1000) {
      this.messages.shift();
    }

    return message;
  }

  getMessages(room = null, limit = 50, offset = 0) {
    let filteredMessages = this.messages;

    if (room) {
      filteredMessages = this.messages.filter(
        (m) => m.room === room && !m.isPrivate
      );
    }

    return filteredMessages
      .slice(-limit - offset, -offset || undefined)
      .map((m) => m.toJSON());
  }

  getPrivateMessages(userId1, userId2, limit = 50) {
    return this.messages
      .filter(
        (m) =>
          m.isPrivate &&
          ((m.senderId === userId1 && m.recipientId === userId2) ||
            (m.senderId === userId2 && m.recipientId === userId1))
      )
      .slice(-limit)
      .map((m) => m.toJSON());
  }

  searchMessages(query, room = null) {
    let filteredMessages = this.messages;

    if (room) {
      filteredMessages = this.messages.filter((m) => m.room === room);
    }

    return filteredMessages
      .filter((m) => m.content.toLowerCase().includes(query.toLowerCase()))
      .map((m) => m.toJSON());
  }

  // Typing methods
  setTyping(socketId, username, room, isTyping) {
    if (isTyping) {
      this.typingUsers.set(socketId, { username, room });
    } else {
      this.typingUsers.delete(socketId);
    }
  }

  getTypingUsers(room) {
    return Array.from(this.typingUsers.values())
      .filter((t) => t.room === room)
      .map((t) => t.username);
  }

  clearTyping(socketId) {
    this.typingUsers.delete(socketId);
  }
}

module.exports = new Storage();
