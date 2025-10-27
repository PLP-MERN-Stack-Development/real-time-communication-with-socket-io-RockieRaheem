// socket/handlers.js - Socket.io event handlers
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const Message = require("../models/Message");
const storage = require("../utils/storage");

const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // User authentication and join
    socket.on("user_join", ({ username, token }) => {
      try {
        // Create user
        const user = new User(uuidv4(), username, socket.id);
        storage.addUser(user);

        // Join default room
        socket.join("general");
        storage.addUserToRoom(socket.id, "general");

        // Send user info back
        socket.emit("user_authenticated", {
          userId: user.id,
          username: user.username,
          socketId: socket.id,
        });

        // Notify all users
        io.emit("user_list", storage.getAllUsers());
        io.to("general").emit("user_joined", {
          username: user.username,
          userId: user.id,
          room: "general",
        });

        // Send room list
        socket.emit("room_list", storage.getAllRooms());

        // Send recent messages
        const recentMessages = storage.getMessages("general", 50);
        socket.emit("message_history", recentMessages);

        console.log(`${username} joined the chat`);
      } catch (error) {
        console.error("Error in user_join:", error);
        socket.emit("error", { message: "Failed to join chat" });
      }
    });

    // Send message to room
    socket.on("send_message", ({ content, room = "general" }) => {
      try {
        const user = storage.getUser(socket.id);
        if (!user) {
          socket.emit("error", { message: "User not authenticated" });
          return;
        }

        const message = new Message(user.id, user.username, content, room);
        storage.addMessage(message);

        io.to(room).emit("receive_message", message.toJSON());

        // Send notification to other users in room
        socket.to(room).emit("new_message_notification", {
          messageId: message.id,
          from: user.username,
          room: room,
          preview: content.substring(0, 50),
        });
      } catch (error) {
        console.error("Error in send_message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Send private message
    socket.on("private_message", ({ recipientId, content }) => {
      try {
        const sender = storage.getUser(socket.id);
        if (!sender) {
          socket.emit("error", { message: "User not authenticated" });
          return;
        }

        const recipient =
          storage.getUserByUsername(recipientId) ||
          Array.from(storage.users.values()).find((u) => u.id === recipientId);

        if (!recipient) {
          socket.emit("error", { message: "Recipient not found" });
          return;
        }

        const message = new Message(
          sender.id,
          sender.username,
          content,
          null,
          true,
          recipient.id
        );
        storage.addMessage(message);

        // Send to both sender and recipient
        socket.emit("receive_private_message", message.toJSON());
        io.to(recipient.socketId).emit(
          "receive_private_message",
          message.toJSON()
        );

        // Notification to recipient
        io.to(recipient.socketId).emit("new_message_notification", {
          messageId: message.id,
          from: sender.username,
          isPrivate: true,
          preview: content.substring(0, 50),
        });
      } catch (error) {
        console.error("Error in private_message:", error);
        socket.emit("error", { message: "Failed to send private message" });
      }
    });

    // Typing indicator
    socket.on("typing", ({ room, isTyping }) => {
      try {
        const user = storage.getUser(socket.id);
        if (!user) return;

        storage.setTyping(socket.id, user.username, room, isTyping);
        const typingUsers = storage.getTypingUsers(room);

        socket.to(room).emit("typing_users", {
          room,
          users: typingUsers,
        });
      } catch (error) {
        console.error("Error in typing:", error);
      }
    });

    // Join room
    socket.on("join_room", ({ roomName }) => {
      try {
        const user = storage.getUser(socket.id);
        if (!user) {
          socket.emit("error", { message: "User not authenticated" });
          return;
        }

        // Leave current room
        socket.leave(user.currentRoom);
        storage.removeUserFromRoom(socket.id, user.currentRoom);

        // Join new room
        socket.join(roomName);
        storage.addUserToRoom(socket.id, roomName);

        // Notify both rooms
        io.to(user.currentRoom).emit("user_left_room", {
          username: user.username,
          room: user.currentRoom,
        });

        io.to(roomName).emit("user_joined_room", {
          username: user.username,
          room: roomName,
        });

        // Send room messages
        const roomMessages = storage.getMessages(roomName, 50);
        socket.emit("message_history", roomMessages);

        socket.emit("room_joined", { room: roomName });
        console.log(`${user.username} joined room: ${roomName}`);
      } catch (error) {
        console.error("Error in join_room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // Create room
    socket.on("create_room", ({ roomName }) => {
      try {
        const user = storage.getUser(socket.id);
        if (!user) {
          socket.emit("error", { message: "User not authenticated" });
          return;
        }

        const room = storage.createRoom(roomName, user.id);
        io.emit("room_list", storage.getAllRooms());
        socket.emit("room_created", room.toJSON());
        console.log(`${user.username} created room: ${roomName}`);
      } catch (error) {
        console.error("Error in create_room:", error);
        socket.emit("error", { message: "Failed to create room" });
      }
    });

    // Message reactions
    socket.on("add_reaction", ({ messageId, emoji }) => {
      try {
        const user = storage.getUser(socket.id);
        if (!user) return;

        const message = storage.messages.find((m) => m.id === messageId);
        if (message) {
          message.addReaction(user.id, emoji);

          // Broadcast to room or private recipient
          if (message.isPrivate) {
            io.to(message.recipientId).emit("message_reaction", {
              messageId,
              reactions: message.reactions,
            });
            socket.emit("message_reaction", {
              messageId,
              reactions: message.reactions,
            });
          } else {
            io.to(message.room).emit("message_reaction", {
              messageId,
              reactions: message.reactions,
            });
          }
        }
      } catch (error) {
        console.error("Error in add_reaction:", error);
      }
    });

    // Mark message as read
    socket.on("mark_read", ({ messageId }) => {
      try {
        const user = storage.getUser(socket.id);
        if (!user) return;

        const message = storage.messages.find((m) => m.id === messageId);
        if (message) {
          message.markAsRead(user.id);

          // Notify sender
          const sender = Array.from(storage.users.values()).find(
            (u) => u.id === message.senderId
          );
          if (sender) {
            io.to(sender.socketId).emit("message_read", {
              messageId,
              readBy: user.username,
            });
          }
        }
      } catch (error) {
        console.error("Error in mark_read:", error);
      }
    });

    // Get message history with pagination
    socket.on("get_messages", ({ room, limit = 50, offset = 0 }) => {
      try {
        const messages = storage.getMessages(room, limit, offset);
        socket.emit("message_history", messages);
      } catch (error) {
        console.error("Error in get_messages:", error);
      }
    });

    // Get private message history
    socket.on("get_private_messages", ({ recipientId, limit = 50 }) => {
      try {
        const user = storage.getUser(socket.id);
        if (!user) return;

        const messages = storage.getPrivateMessages(
          user.id,
          recipientId,
          limit
        );
        socket.emit("private_message_history", messages);
      } catch (error) {
        console.error("Error in get_private_messages:", error);
      }
    });

    // Search messages
    socket.on("search_messages", ({ query, room }) => {
      try {
        const messages = storage.searchMessages(query, room);
        socket.emit("search_results", messages);
      } catch (error) {
        console.error("Error in search_messages:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      try {
        const user = storage.removeUser(socket.id);
        if (user) {
          storage.clearTyping(socket.id);

          io.emit("user_list", storage.getAllUsers());
          io.to(user.currentRoom).emit("user_left", {
            username: user.username,
            userId: user.id,
          });

          console.log(`${user.username} disconnected`);
        }
      } catch (error) {
        console.error("Error in disconnect:", error);
      }
    });
  });
};

module.exports = setupSocketHandlers;
