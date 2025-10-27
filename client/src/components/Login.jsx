// components/Login.jsx - Login component
import { useState } from "react";
import { socket } from "../socket/socket";
import useChatStore from "../store/useChatStore";
import { FaUser, FaSignInAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    setLoading(true);

    try {
      // Connect to socket
      socket.connect();
      socket.emit("user_join", { username: username.trim() });

      // Wait for authentication
      socket.once("user_authenticated", (data) => {
        useChatStore.setState({ currentUser: data });
        toast.success(`Welcome, ${username}!`);
        onLogin(username);
        setLoading(false);
      });

      socket.once("error", (error) => {
        toast.error(error.message || "Failed to join chat");
        setLoading(false);
      });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to connect to chat");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <FaUser className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Chat
          </h1>
          <p className="text-gray-600">Enter your username to start chatting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              maxLength={20}
              disabled={loading}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              {username.length}/20 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <FaSignInAlt />
                <span>Join Chat</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Real-time messaging with Socket.io</p>
          <p className="mt-1">Private messages, rooms, and more!</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
