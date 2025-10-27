// components/UserList.jsx - Online users list with private messaging
import useChatStore from "../store/useChatStore";
import { FaCircle, FaComments, FaTimes } from "react-icons/fa";

const UserList = () => {
  const { users, currentUser, selectedUser, setSelectedUser } = useChatStore();

  const otherUsers = users.filter((user) => user.id !== currentUser?.userId);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleClosePrivateChat = () => {
    setSelectedUser(null);
  };

  return (
    <div className="w-64 bg-white border-l h-full flex flex-col">
      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaCircle className="text-green-400 text-xs" />
          Online Users ({otherUsers.length})
        </h2>
      </div>

      {selectedUser && (
        <div className="p-3 bg-purple-50 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaComments className="text-purple-600" />
            <span className="text-sm font-medium">
              Chat with {selectedUser.username}
            </span>
          </div>
          <button
            onClick={handleClosePrivateChat}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {otherUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p>No other users online</p>
          </div>
        ) : (
          <div className="divide-y">
            {otherUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserClick(user)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition text-left ${
                  selectedUser?.id === user.id ? "bg-purple-50" : ""
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.online ? "Online" : "Offline"}
                  </p>
                </div>
                <FaComments className="text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current user info */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
            {currentUser?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">
              {currentUser?.username}
            </p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <FaCircle size={8} />
              Online
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
