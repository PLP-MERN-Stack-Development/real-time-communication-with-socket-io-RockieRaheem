// models/Message.js - Message model
const { v4: uuidv4 } = require("uuid");

class Message {
  constructor(
    senderId,
    senderName,
    content,
    room = "general",
    isPrivate = false,
    recipientId = null
  ) {
    this.id = uuidv4();
    this.senderId = senderId;
    this.senderName = senderName;
    this.content = content;
    this.room = room;
    this.isPrivate = isPrivate;
    this.recipientId = recipientId;
    this.timestamp = new Date();
    this.reactions = {};
    this.readBy = [];
    this.fileUrl = null;
    this.fileName = null;
  }

  addReaction(userId, emoji) {
    if (!this.reactions[emoji]) {
      this.reactions[emoji] = [];
    }
    if (!this.reactions[emoji].includes(userId)) {
      this.reactions[emoji].push(userId);
    }
  }

  removeReaction(userId, emoji) {
    if (this.reactions[emoji]) {
      this.reactions[emoji] = this.reactions[emoji].filter(
        (id) => id !== userId
      );
      if (this.reactions[emoji].length === 0) {
        delete this.reactions[emoji];
      }
    }
  }

  markAsRead(userId) {
    if (!this.readBy.includes(userId)) {
      this.readBy.push(userId);
    }
  }

  toJSON() {
    return {
      id: this.id,
      senderId: this.senderId,
      senderName: this.senderName,
      content: this.content,
      room: this.room,
      isPrivate: this.isPrivate,
      recipientId: this.recipientId,
      timestamp: this.timestamp,
      reactions: this.reactions,
      readBy: this.readBy,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
    };
  }
}

module.exports = Message;
