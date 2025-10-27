// components/MessageInput.jsx - Message input with typing indicator and file upload
import { useState, useRef } from "react";
import { socket } from "../socket/socket";
import useChatStore from "../store/useChatStore";
import { FaPaperPlane, FaPaperclip, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { currentRoom, selectedUser } = useChatStore();

  const handleTyping = () => {
    socket.emit("typing", { room: currentRoom, isTyping: true });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { room: currentRoom, isTyping: false });
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Stop typing indicator
    socket.emit("typing", { room: currentRoom, isTyping: false });

    if (selectedUser) {
      // Send private message
      socket.emit("private_message", {
        recipientId: selectedUser.id,
        content: message.trim(),
      });
    } else {
      // Send to room
      socket.emit("send_message", {
        content: message.trim(),
        room: currentRoom,
      });
    }

    setMessage("");
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${
          import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"
        }/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        const fileMessage = `📎 ${data.file.name}\n${window.location.origin}${data.file.url}`;

        if (selectedUser) {
          socket.emit("private_message", {
            recipientId: selectedUser.id,
            content: fileMessage,
          });
        } else {
          socket.emit("send_message", {
            content: fileMessage,
            room: currentRoom,
          });
        }

        toast.success("File uploaded successfully");
      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="border-t bg-white p-4">
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-3 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
          title="Upload file"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FaPaperclip size={20} />
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-3 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
          title="Add emoji"
        >
          <FaSmile size={20} />
        </button>

        <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder={
              selectedUser
                ? `Message ${selectedUser.username}...`
                : `Message #${currentRoom}...`
            }
            className="flex-1 bg-transparent py-3 outline-none"
            maxLength={1000}
          />
          <span className="text-xs text-gray-400 ml-2">
            {message.length}/1000
          </span>
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          title="Send message"
        >
          <FaPaperPlane size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
