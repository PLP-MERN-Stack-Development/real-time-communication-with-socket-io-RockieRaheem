// components/RoomList.jsx - Chat rooms sidebar
import { useState } from "react";
import useChatStore from "../store/useChatStore";
import { socket } from "../socket/socket";
import { FaHashtag, FaPlus, FaTimes, FaCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const RoomList = () => {
  const { rooms, currentRoom, setCurrentRoom, unreadCounts } = useChatStore();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const handleRoomChange = (roomName) => {
    setCurrentRoom(roomName);
    toast.success(`Switched to #${roomName}`);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();

    if (!newRoomName.trim()) {
      toast.error("Room name cannot be empty");
      return;
    }

    if (newRoomName.length < 3) {
      toast.error("Room name must be at least 3 characters");
      return;
    }

    socket.emit("create_room", { roomName: newRoomName.trim() });
    setNewRoomName("");
    setShowCreateRoom(false);
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold mb-2">Chat Rooms</h2>
        <button
          onClick={() => setShowCreateRoom(!showCreateRoom)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm"
        >
          {showCreateRoom ? <FaTimes /> : <FaPlus />}
          {showCreateRoom ? "Cancel" : "New Room"}
        </button>
      </div>

      {showCreateRoom && (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <form onSubmit={handleCreateRoom} className="space-y-2">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room name..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:border-purple-500 text-sm"
              maxLength={20}
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition text-sm"
            >
              Create Room
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <div className="p-4 text-gray-400 text-center text-sm">
            No rooms available
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {rooms.map((room) => {
              const unreadCount = unreadCounts[room.name] || 0;
              const isActive = room.name === currentRoom;

              return (
                <button
                  key={room.name}
                  onClick={() => handleRoomChange(room.name)}
                  className={`w-full px-3 py-2 rounded-lg flex items-center justify-between transition text-left ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FaHashtag className="flex-shrink-0" />
                    <span className="truncate">{room.name}</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <FaCircle className="text-green-500 text-xs animate-pulse" />
          <span>Connected</span>
        </div>
      </div>
    </div>
  );
};

export default RoomList;
