// hooks/useSocketEvents.js - Custom hook for managing socket event listeners
import { useEffect } from "react";
import { socket } from "../socket/socket";
import useChatStore from "../store/useChatStore";
import { playNotificationSound } from "../utils/sounds";
import toast from "react-hot-toast";

const useSocketEvents = () => {
  const {
    setIsConnected,
    setUsers,
    addMessage,
    addPrivateMessage,
    setTypingUsers,
    setRooms,
    addRoom,
    updateMessageReaction,
    addNotification,
    incrementUnreadCount,
    currentRoom,
    currentUser,
  } = useChatStore();

  useEffect(() => {
    // Connection events
    const onConnect = () => {
      console.log("Connected to server");
      setIsConnected(true);
      toast.success("Connected to chat server");
    };

    const onDisconnect = () => {
      console.log("Disconnected from server");
      setIsConnected(false);
      toast.error("Disconnected from server");
    };

    const onConnectError = (error) => {
      console.error("Connection error:", error);
      toast.error("Failed to connect to server");
    };

    // Authentication
    const onUserAuthenticated = (data) => {
      console.log("User authenticated:", data);
      useChatStore.setState({ currentUser: data });
    };

    // User events
    const onUserList = (users) => {
      setUsers(users);
    };

    const onUserJoined = ({ username, room }) => {
      toast.success(`${username} joined ${room}`, { duration: 2000 });
      addMessage({
        id: `system-${Date.now()}`,
        content: `${username} joined the chat`,
        system: true,
        timestamp: new Date().toISOString(),
      });
    };

    const onUserLeft = ({ username }) => {
      toast(`${username} left the chat`, { duration: 2000 });
      addMessage({
        id: `system-${Date.now()}`,
        content: `${username} left the chat`,
        system: true,
        timestamp: new Date().toISOString(),
      });
    };

    // Message events
    const onReceiveMessage = (message) => {
      addMessage(message);

      // Only show notification and play sound if not current room
      if (
        message.room !== currentRoom &&
        message.senderId !== currentUser?.userId
      ) {
        incrementUnreadCount(message.room);
        playNotificationSound();
        showBrowserNotification(
          `New message in ${message.room}`,
          `${message.senderName}: ${message.content.substring(0, 50)}...`
        );
      }
    };

    const onReceivePrivateMessage = (message) => {
      addPrivateMessage(message);

      // Show notification if message is from someone else
      if (message.senderId !== currentUser?.userId) {
        playNotificationSound();
        toast(`New private message from ${message.senderName}`, {
          icon: "💬",
          duration: 3000,
        });
        showBrowserNotification(
          `Private message from ${message.senderName}`,
          message.content.substring(0, 50)
        );
      }
    };

    const onMessageHistory = (messages) => {
      useChatStore.setState({ messages });
    };

    const onPrivateMessageHistory = (messages) => {
      if (messages.length > 0) {
        const otherUserId =
          messages[0].senderId === currentUser?.userId
            ? messages[0].recipientId
            : messages[0].senderId;
        useChatStore.getState().setPrivateMessages(otherUserId, messages);
      }
    };

    const onMessageReaction = ({ messageId, reactions }) => {
      updateMessageReaction(messageId, reactions);
    };

    const onMessageRead = ({ messageId, readBy }) => {
      console.log(`Message ${messageId} read by ${readBy}`);
    };

    const onNewMessageNotification = (notification) => {
      addNotification(notification);
      playNotificationSound();
    };

    // Typing events
    const onTypingUsers = ({ room, users }) => {
      if (room === currentRoom) {
        setTypingUsers(users);
      }
    };

    // Room events
    const onRoomList = (rooms) => {
      setRooms(rooms);
    };

    const onRoomCreated = (room) => {
      addRoom(room);
      toast.success(`Room "${room.name}" created`);
    };

    const onRoomJoined = ({ room }) => {
      toast.success(`Joined room: ${room}`);
    };

    const onSearchResults = (messages) => {
      console.log("Search results:", messages);
    };

    // Error events
    const onError = (error) => {
      console.error("Socket error:", error);
      toast.error(error.message || "An error occurred");
    };

    // Register all event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("user_authenticated", onUserAuthenticated);
    socket.on("user_list", onUserList);
    socket.on("user_joined", onUserJoined);
    socket.on("user_left", onUserLeft);
    socket.on("receive_message", onReceiveMessage);
    socket.on("receive_private_message", onReceivePrivateMessage);
    socket.on("message_history", onMessageHistory);
    socket.on("private_message_history", onPrivateMessageHistory);
    socket.on("message_reaction", onMessageReaction);
    socket.on("message_read", onMessageRead);
    socket.on("new_message_notification", onNewMessageNotification);
    socket.on("typing_users", onTypingUsers);
    socket.on("room_list", onRoomList);
    socket.on("room_created", onRoomCreated);
    socket.on("room_joined", onRoomJoined);
    socket.on("search_results", onSearchResults);
    socket.on("error", onError);

    // Cleanup function
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("user_authenticated", onUserAuthenticated);
      socket.off("user_list", onUserList);
      socket.off("user_joined", onUserJoined);
      socket.off("user_left", onUserLeft);
      socket.off("receive_message", onReceiveMessage);
      socket.off("receive_private_message", onReceivePrivateMessage);
      socket.off("message_history", onMessageHistory);
      socket.off("private_message_history", onPrivateMessageHistory);
      socket.off("message_reaction", onMessageReaction);
      socket.off("message_read", onMessageRead);
      socket.off("new_message_notification", onNewMessageNotification);
      socket.off("typing_users", onTypingUsers);
      socket.off("room_list", onRoomList);
      socket.off("room_created", onRoomCreated);
      socket.off("room_joined", onRoomJoined);
      socket.off("search_results", onSearchResults);
      socket.off("error", onError);
    };
  }, [currentRoom, currentUser]);
};

// Browser notification helper
const showBrowserNotification = (title, body) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/vite.svg",
      badge: "/vite.svg",
    });
  }
};

export default useSocketEvents;
