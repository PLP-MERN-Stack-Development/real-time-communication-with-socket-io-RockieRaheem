// pages/ChatRoom.jsx - Main chat room component
import { useEffect } from "react";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import UserList from "../components/UserList";
import RoomList from "../components/RoomList";
import TypingIndicator from "../components/TypingIndicator";
import useChatStore from "../store/useChatStore";
import useSocketEvents from "../hooks/useSocketEvents";
import { socket } from "../socket/socket";
import { FaSignOutAlt, FaSearch } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

const ChatRoom = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const {
    messages,
    currentRoom,
    currentUser,
    selectedUser,
    privateMessages,
    isConnected,
  } = useChatStore();

  // Setup socket event listeners
  useSocketEvents();

  useEffect(() => {
    // Clear unread count when viewing room
    useChatStore.getState().clearUnreadCount(currentRoom);
  }, [currentRoom, messages]);

  const handleLogout = () => {
    socket.disconnect();
    useChatStore.getState().reset();
    toast.success("Logged out successfully");
    onLogout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      socket.emit("search_messages", {
        query: searchQuery.trim(),
        room: currentRoom,
      });
      toast.success("Searching messages...");
    }
  };

  // Get messages to display (room messages or private messages)
  const displayMessages = selectedUser
    ? privateMessages[selectedUser.id] || []
    : messages.filter((msg) => msg.room === currentRoom || msg.system);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Room List Sidebar */}
      <RoomList />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedUser ? `@${selectedUser.username}` : `#${currentRoom}`}
              </h1>
              <p className="text-sm text-gray-500">
                {selectedUser ? "Private conversation" : "Public room"}
              </p>
            </div>
            {!isConnected && (
              <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                Reconnecting...
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Search messages"
            >
              <FaSearch className="text-gray-600" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="bg-gray-50 border-b px-6 py-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="flex-1 px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Messages */}
        <MessageList messages={displayMessages} />

        {/* Typing Indicator */}
        {!selectedUser && <TypingIndicator />}

        {/* Message Input */}
        <MessageInput />
      </div>

      {/* User List Sidebar */}
      <UserList />
    </div>
  );
};

export default ChatRoom;
