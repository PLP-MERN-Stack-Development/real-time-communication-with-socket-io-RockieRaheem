// models/Room.js - Chat room model
class Room {
  constructor(name, createdBy) {
    this.name = name;
    this.createdBy = createdBy;
    this.createdAt = new Date();
    this.members = [];
    this.messages = [];
  }

  addMember(userId) {
    if (!this.members.includes(userId)) {
      this.members.push(userId);
    }
  }

  removeMember(userId) {
    this.members = this.members.filter((id) => id !== userId);
  }

  addMessage(message) {
    this.messages.push(message);
    // Keep only last 100 messages per room to prevent memory issues
    if (this.messages.length > 100) {
      this.messages.shift();
    }
  }

  toJSON() {
    return {
      name: this.name,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      members: this.members,
      messageCount: this.messages.length,
    };
  }
}

module.exports = Room;
