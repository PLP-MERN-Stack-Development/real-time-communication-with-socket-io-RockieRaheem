// store/useChatStore.js - Global chat state management using Zustand
import { create } from "zustand";
import { socket } from "../socket/socket";

const useChatStore = create((set, get) => ({
  // User state
  currentUser: null,
  users: [],
  isConnected: false,

  // Message state
  messages: [],
  privateMessages: {},

  // Room state
  currentRoom: "general",
  rooms: [],

  // UI state
  typingUsers: [],
  notifications: [],
  unreadCounts: {},
  selectedUser: null,

  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),

  setIsConnected: (status) => set({ isConnected: status }),

  setUsers: (users) => set({ users }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages) => set({ messages }),

  addPrivateMessage: (message) => {
    const state = get();
    const otherUserId =
      message.senderId === state.currentUser?.userId
        ? message.recipientId
        : message.senderId;

    set((state) => ({
      privateMessages: {
        ...state.privateMessages,
        [otherUserId]: [...(state.privateMessages[otherUserId] || []), message],
      },
    }));
  },

  setPrivateMessages: (userId, messages) =>
    set((state) => ({
      privateMessages: {
        ...state.privateMessages,
        [userId]: messages,
      },
    })),

  updateMessageReaction: (messageId, reactions) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, reactions } : msg
      ),
    })),

  setCurrentRoom: (room) => {
    set({ currentRoom: room });
    socket.emit("join_room", { roomName: room });
  },

  setRooms: (rooms) => set({ rooms }),

  addRoom: (room) =>
    set((state) => ({
      rooms: [...state.rooms, room],
    })),

  setTypingUsers: (users) => set({ typingUsers: users }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Date.now() },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  incrementUnreadCount: (room) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [room]: (state.unreadCounts[room] || 0) + 1,
      },
    })),

  clearUnreadCount: (room) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [room]: 0,
      },
    })),

  setSelectedUser: (user) => set({ selectedUser: user }),

  // Clear all state on logout
  reset: () =>
    set({
      currentUser: null,
      users: [],
      messages: [],
      privateMessages: {},
      currentRoom: "general",
      rooms: [],
      typingUsers: [],
      notifications: [],
      unreadCounts: {},
      selectedUser: null,
      isConnected: false,
    }),
}));

export default useChatStore;
