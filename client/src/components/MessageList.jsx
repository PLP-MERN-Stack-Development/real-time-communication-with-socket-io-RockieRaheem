// components/MessageList.jsx - Message list component with reactions and read receipts
import { useEffect, useRef } from "react";
import { formatMessageTime } from "../utils/formatTime";
import useChatStore from "../store/useChatStore";
import { socket } from "../socket/socket";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const { currentUser } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReaction = (messageId, emoji) => {
    socket.emit("add_reaction", { messageId, emoji });
  };

  const handleMarkRead = (messageId) => {
    socket.emit("mark_read", { messageId });
  };

  const reactions = ["👍", "❤️", "😂", "😮", "😢", "🎉"];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <p className="text-xl mb-2">💬</p>
            <p>No messages yet. Start the conversation!</p>
          </div>
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.senderId === currentUser?.userId;
          const isSystemMessage = message.system;

          if (isSystemMessage) {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-gray-200 text-gray-600 text-sm px-4 py-1 rounded-full">
                  {message.content}
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              } message-enter-active`}
            >
              <div
                className={`max-w-[70%] ${
                  isOwnMessage ? "items-end" : "items-start"
                } flex flex-col`}
              >
                {!isOwnMessage && (
                  <span className="text-xs text-gray-500 mb-1 px-2">
                    {message.senderName}
                  </span>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isOwnMessage
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm"
                      : "bg-gray-200 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {message.fileUrl && (
                    <div className="mt-2">
                      <a
                        href={message.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline"
                      >
                        📎 {message.fileName}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 px-2">
                  <span className="text-xs text-gray-400">
                    {formatMessageTime(message.timestamp)}
                  </span>

                  {isOwnMessage &&
                    message.readBy &&
                    message.readBy.length > 0 && (
                      <span className="text-blue-500 text-xs flex items-center gap-1">
                        <FaCheckDouble size={10} />
                        Read
                      </span>
                    )}
                </div>

                {/* Reactions */}
                {message.reactions &&
                  Object.keys(message.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(message.reactions).map(
                        ([emoji, users]) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(message.id, emoji)}
                            className="bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs hover:bg-gray-50 flex items-center gap-1"
                            title={`${users.length} reaction(s)`}
                          >
                            <span>{emoji}</span>
                            <span className="text-gray-600">
                              {users.length}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  )}

                {/* Quick reaction buttons */}
                <div className="flex gap-1 mt-1 opacity-0 hover:opacity-100 transition-opacity">
                  {reactions.slice(0, 3).map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(message.id, emoji)}
                      className="bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-50 text-xs"
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
