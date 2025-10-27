// socket.js - Enhanced Socket.io client setup with all features

import { io } from "socket.io-client";

// Socket.io connection URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Create socket instance with reconnection logic
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

// Socket connection manager
class SocketManager {
  constructor() {
    this.isConnected = false;
    this.listeners = new Map();
    this.setupDefaultListeners();
  }

  setupDefaultListeners() {
    socket.on("connect", () => {
      console.log("✅ Connected to server");
      this.isConnected = true;
      this.emit("connection_status", true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason);
      this.isConnected = false;
      this.emit("connection_status", false);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      this.emit("connection_error", error);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      this.emit("error", error);
    });
  }

  connect(username, token = null) {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("user_join", { username, token });
  }

  disconnect() {
    socket.disconnect();
  }

  // Event emitter
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data));
    }
  }

  // Chat methods
  sendMessage(content, room = "general") {
    socket.emit("send_message", { content, room });
  }

  sendPrivateMessage(recipientId, content) {
    socket.emit("private_message", { recipientId, content });
  }

  setTyping(room, isTyping) {
    socket.emit("typing", { room, isTyping });
  }

  joinRoom(roomName) {
    socket.emit("join_room", { roomName });
  }

  createRoom(roomName) {
    socket.emit("create_room", { roomName });
  }

  addReaction(messageId, emoji) {
    socket.emit("add_reaction", { messageId, emoji });
  }

  markAsRead(messageId) {
    socket.emit("mark_read", { messageId });
  }

  getMessages(room, limit = 50, offset = 0) {
    socket.emit("get_messages", { room, limit, offset });
  }

  getPrivateMessages(recipientId, limit = 50) {
    socket.emit("get_private_messages", { recipientId, limit });
  }

  searchMessages(query, room = null) {
    socket.emit("search_messages", { query, room });
  }
}

export const socketManager = new SocketManager();

export default socket;
