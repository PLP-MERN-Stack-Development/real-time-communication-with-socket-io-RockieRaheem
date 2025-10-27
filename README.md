# 💬 Real-Time Chat Application with Socket.io

A fully-featured real-time chat application built with Socket.io, React, Express, and Node.js. This application demonstrates bidirectional communication, real-time messaging, and advanced chat features.

![Chat Application](https://img.shields.io/badge/Socket.io-v4.6.1-blue)
![React](https://img.shields.io/badge/React-v18.2.0-61DAFB)
![Express](https://img.shields.io/badge/Express-v4.18.2-green)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933)

## ✨ Features Implemented

### ✅ Core Chat Functionality (Task 2)

- ✅ Real-time messaging using Socket.io
- ✅ User authentication (username-based with JWT support)
- ✅ Global chat room for all users
- ✅ Messages with sender name and timestamp
- ✅ **Typing Indicators**: See when users are composing messages
- ✅ **Online/Offline Status**: Real-time user presence tracking

### 🎯 Advanced Chat Features (Task 3)

- ✅ **Private Messaging**: Direct messages between users
- ✅ **Multiple Chat Rooms**: Create and join different channels
- ✅ **"User is Typing" Indicator**: Live typing status
- ✅ **File/Image Sharing**: Upload and share files (up to 5MB)
- ✅ **Read Receipts**: Know when messages are read
- ✅ **Message Reactions**: React with emojis (👍, ❤️, 😂, 😮, 😢, 🎉)

### 🔔 Real-Time Notifications (Task 4)

- ✅ **New Message Notifications**: Alerts for incoming messages
- ✅ **User Join/Leave Notifications**: Activity alerts
- ✅ **Unread Message Count**: Badge showing unread messages per room
- ✅ **Sound Notifications**: Audio alerts using Web Audio API
- ✅ **Browser Notifications**: Desktop notifications with Web Notifications API

### ⚡ Performance & UX Optimizations (Task 5)

- ✅ **Message Pagination**: Load older messages on demand
- ✅ **Automatic Reconnection**: Handles disconnections gracefully
- ✅ **Optimized Socket.io**: Uses rooms and namespaces for performance
- ✅ **Message Delivery Acknowledgment**: Confirm message delivery
- ✅ **Message Search**: Find messages by content
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🏗️ Project Structure

```
real-time-communication-with-socket-io/
├── client/                      # React front-end
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Login.jsx        # Login interface
│   │   │   ├── MessageList.jsx  # Message display with reactions
│   │   │   ├── MessageInput.jsx # Input with file upload & emoji
│   │   │   ├── UserList.jsx     # Online users sidebar
│   │   │   ├── RoomList.jsx     # Chat rooms sidebar
│   │   │   └── TypingIndicator.jsx # Typing status
│   │   ├── pages/               # Page components
│   │   │   └── ChatRoom.jsx     # Main chat interface
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useSocketEvents.js
│   │   │   └── useNotifications.js
│   │   ├── store/               # State management (Zustand)
│   │   │   └── useChatStore.js
│   │   ├── socket/              # Socket.io client
│   │   │   └── socket.js
│   │   ├── utils/               # Utilities
│   │   │   ├── sounds.js        # Audio notifications
│   │   │   └── formatTime.js    # Time formatting
│   │   ├── App.jsx              # Main component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Styles with Tailwind
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                      # Node.js back-end
│   ├── config/                  # Configuration
│   │   └── jwt.js               # JWT auth
│   ├── models/                  # Data models
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Room.js
│   ├── socket/                  # Socket.io handlers
│   │   └── handlers.js          # All socket events
│   ├── utils/                   # Utilities
│   │   ├── storage.js           # In-memory storage
│   │   └── fileUpload.js        # Multer config
│   ├── server.js                # Main server
│   ├── package.json
│   └── .env                     # Environment variables
│
├── README.md                    # This file
└── Week5-Assignment.md          # Assignment details
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd real-time-communication-with-socket-io-RockieRaheem
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create `.env` file in the `server` directory:

   ```env
   PORT=5000
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   ```

   Create `.env` file in the `client` directory:

   ```env
   VITE_SOCKET_URL=http://localhost:5000
   ```

### Running the Application

1. **Start the server** (from `server` directory)

   ```bash
   npm run dev
   ```

   ✅ Server will run on http://localhost:5000

2. **Start the client** (from `client` directory, in a new terminal)

   ```bash
   npm run dev
   ```

   ✅ Client will run on http://localhost:5173

3. **Open your browser**
   - Navigate to http://localhost:5173
   - Enter a username to join the chat
   - Open multiple browser tabs/windows to test multi-user functionality

## 🎯 How to Use

### Joining the Chat

1. Enter a username (3-20 characters)
2. Click "Join Chat"
3. You'll be connected to the default "general" room

### Sending Messages

- Type your message in the input field at the bottom
- Press Enter or click the send button (✈️)
- Messages appear in real-time for all users in the room

### Private Messaging

1. Click on any user in the "Online Users" sidebar on the right
2. Type your private message
3. Only you and the selected user can see these messages
4. Click the X button to return to public chat

### Creating & Joining Rooms

1. Click "New Room" button in the left sidebar
2. Enter a room name (3-20 characters)
3. Click "Create Room"
4. Click on any room name to switch to that room
5. Unread message counts are shown as badges

### File Sharing

1. Click the paperclip icon (📎) in the message input
2. Select a file (images: jpg, png, gif; docs: pdf, doc, txt)
3. Maximum file size: 5MB
4. File will be uploaded and shared in the chat

### Message Reactions

1. Hover over any message
2. Click on one of the quick reaction buttons (👍, ❤️, 😂)
3. See reaction counts and who reacted

### Emoji Picker

1. Click the smile icon (😊) in the message input
2. Select any emoji to add to your message

### Searching Messages

1. Click the search icon (🔍) in the header
2. Enter your search query
3. Press Enter to search messages in the current room

### Typing Indicators

- When you start typing, other users see "Username is typing..."
- Indicators disappear after 2 seconds of inactivity

## 🛠️ Technologies Used

### Backend Technologies

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Socket.io** v4.6.1 - Real-time bidirectional event-based communication
- **JWT (jsonwebtoken)** - Authentication tokens
- **Multer** - File upload middleware
- **UUID** - Unique identifier generation
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### Frontend Technologies

- **React 18** - Modern UI library
- **Vite** - Next-generation frontend build tool
- **Socket.io Client** v4.6.1 - WebSocket client
- **Zustand** - Lightweight state management
- **Tailwind CSS** v3 - Utility-first CSS framework
- **React Icons** - Popular icon library
- **React Hot Toast** - Beautiful toast notifications
- **Emoji Picker React** - Emoji picker component
- **date-fns** - Modern date utility library

## 📡 API Documentation

### REST API Endpoints

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| GET    | `/`                    | Server status and endpoints        |
| GET    | `/api/health`          | Health check with statistics       |
| GET    | `/api/messages`        | Get messages (supports pagination) |
| GET    | `/api/messages/search` | Search messages by query           |
| GET    | `/api/users`           | Get all online users               |
| GET    | `/api/rooms`           | Get all available rooms            |
| POST   | `/api/upload`          | Upload file (multipart/form-data)  |
| POST   | `/api/auth/login`      | Generate JWT token                 |
| POST   | `/api/auth/verify`     | Verify JWT token                   |

### Socket.io Events

#### Client → Server Events

| Event                  | Parameters                 | Description             |
| ---------------------- | -------------------------- | ----------------------- |
| `user_join`            | `{ username, token }`      | Join chat with username |
| `send_message`         | `{ content, room }`        | Send message to room    |
| `private_message`      | `{ recipientId, content }` | Send private message    |
| `typing`               | `{ room, isTyping }`       | Set typing status       |
| `join_room`            | `{ roomName }`             | Join specific room      |
| `create_room`          | `{ roomName }`             | Create new room         |
| `add_reaction`         | `{ messageId, emoji }`     | Add emoji reaction      |
| `mark_read`            | `{ messageId }`            | Mark message as read    |
| `get_messages`         | `{ room, limit, offset }`  | Get message history     |
| `get_private_messages` | `{ recipientId, limit }`   | Get private messages    |
| `search_messages`      | `{ query, room }`          | Search messages         |

#### Server → Client Events

| Event                      | Data                             | Description              |
| -------------------------- | -------------------------------- | ------------------------ |
| `user_authenticated`       | `{ userId, username, socketId }` | Authentication success   |
| `user_list`                | `[users]`                        | Updated user list        |
| `user_joined`              | `{ username, userId, room }`     | User joined notification |
| `user_left`                | `{ username, userId }`           | User left notification   |
| `receive_message`          | `Message object`                 | New message received     |
| `receive_private_message`  | `Message object`                 | New private message      |
| `message_history`          | `[messages]`                     | Message history          |
| `private_message_history`  | `[messages]`                     | Private message history  |
| `message_reaction`         | `{ messageId, reactions }`       | Reaction update          |
| `message_read`             | `{ messageId, readBy }`          | Read receipt             |
| `typing_users`             | `{ room, users }`                | Typing users list        |
| `room_list`                | `[rooms]`                        | Available rooms          |
| `room_created`             | `Room object`                    | Room created             |
| `room_joined`              | `{ room }`                       | Room joined success      |
| `new_message_notification` | `Notification object`            | Message notification     |
| `search_results`           | `[messages]`                     | Search results           |
| `error`                    | `{ message }`                    | Error event              |

## 🌐 Deployment Guide

### Deploying the Server

#### Option 1: Render

1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect your repository
4. Configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Add Environment Variables**: PORT, CLIENT_URL, JWT_SECRET, NODE_ENV
5. Deploy

#### Option 2: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and initialize
railway login
cd server
railway init
railway up
```

#### Option 3: Heroku

```bash
# Install Heroku CLI and login
heroku login
cd server
heroku create your-app-name
git push heroku main
```

### Deploying the Client

#### Option 1: Vercel

```bash
cd client
npm run build
npx vercel --prod
```

#### Option 2: Netlify

```bash
cd client
npm run build
# Drag and drop 'dist' folder to netlify.com
```

#### Option 3: GitHub Pages

```bash
cd client
npm run build
# Deploy 'dist' folder
```

### ⚠️ Important Deployment Notes

1. Update `VITE_SOCKET_URL` in client `.env` to deployed server URL
2. Update `CLIENT_URL` in server `.env` to deployed client URL
3. Change `JWT_SECRET` to a strong random string
4. Set `NODE_ENV=production` on the server
5. Ensure CORS is configured for your client domain
6. Create `uploads/` directory on server (or use cloud storage)

## 📸 Features Showcase

### 💡 Key Features Demonstrated

1. **Real-Time Messaging**

   - Instant message delivery using WebSockets
   - No page refresh needed
   - Bidirectional communication

2. **User Presence**

   - Online/offline status indicators
   - Real-time user list updates
   - Join/leave notifications

3. **Multiple Communication Modes**

   - Public rooms for group discussions
   - Private 1-on-1 messaging
   - Room-based conversations

4. **Rich Interactions**

   - Emoji reactions on messages
   - Typing indicators
   - Read receipts
   - File sharing

5. **Modern UX**

   - Beautiful gradient design
   - Responsive mobile layout
   - Toast notifications
   - Smooth animations

6. **Performance Optimized**
   - Automatic reconnection on disconnect
   - Message pagination
   - Efficient socket namespaces
   - Memory-efficient message storage

## 🧪 Testing the Application

### Manual Testing Checklist

- [ ] **Authentication**

  - [ ] Can join with valid username (3-20 chars)
  - [ ] Validation prevents short/empty usernames
  - [ ] JWT token generated and stored

- [ ] **Messaging**

  - [ ] Messages send in real-time
  - [ ] Messages appear for all users
  - [ ] Timestamps displayed correctly
  - [ ] Long messages wrap properly
  - [ ] Special characters handled

- [ ] **Private Messages**

  - [ ] Can click user to start private chat
  - [ ] Messages only visible to participants
  - [ ] Can close private chat
  - [ ] Notification received

- [ ] **Rooms**

  - [ ] Can create new room
  - [ ] Can switch between rooms
  - [ ] Messages isolated per room
  - [ ] Unread counts update

- [ ] **File Upload**

  - [ ] Can upload images
  - [ ] Can upload documents
  - [ ] Size validation (5MB)
  - [ ] Type validation works
  - [ ] Files accessible after upload

- [ ] **Reactions**

  - [ ] Can add emoji reactions
  - [ ] Reactions counted correctly
  - [ ] Can react to own messages
  - [ ] Multiple reactions supported

- [ ] **Typing Indicators**

  - [ ] Shows when user types
  - [ ] Clears after 2 seconds
  - [ ] Shows multiple typers

- [ ] **Notifications**

  - [ ] Browser notification permission requested
  - [ ] Desktop notifications appear
  - [ ] Sound plays on new message
  - [ ] Toast notifications show

- [ ] **Search**

  - [ ] Can search messages
  - [ ] Search works across rooms
  - [ ] Results highlighted

- [ ] **Reconnection**

  - [ ] Auto-reconnects on disconnect
  - [ ] State preserved
  - [ ] Messages still work

- [ ] **Responsive Design**
  - [ ] Works on desktop
  - [ ] Works on tablet
  - [ ] Works on mobile
  - [ ] Layout adapts properly

### Multi-User Testing

1. Open 3+ browser windows/tabs
2. Login with different usernames
3. Test all features simultaneously
4. Verify real-time synchronization

## 🏆 Assignment Completion

### ✅ Task 1: Project Setup (Complete)

- [x] Node.js server with Express
- [x] Socket.io configured on server
- [x] React front-end application
- [x] Socket.io client setup
- [x] Basic connection established

### ✅ Task 2: Core Chat Functionality (Complete)

- [x] User authentication (username + JWT)
- [x] Global chat room
- [x] Messages with sender & timestamp
- [x] Typing indicators
- [x] Online/offline status

### ✅ Task 3: Advanced Chat Features (Complete)

- [x] Private messaging ✅
- [x] Multiple chat rooms ✅
- [x] "User is typing" indicator ✅
- [x] File/image sharing ✅
- [x] Read receipts ✅
- [x] Message reactions ✅

### ✅ Task 4: Real-Time Notifications (Complete)

- [x] New message notifications
- [x] User join/leave notifications
- [x] Unread message count
- [x] Sound notifications
- [x] Browser notifications (Web API)

### ✅ Task 5: Performance & UX (Complete)

- [x] Message pagination
- [x] Reconnection logic
- [x] Optimized Socket.io (rooms/namespaces)
- [x] Message delivery acknowledgment
- [x] Message search functionality
- [x] Responsive design (mobile/desktop)

## 📚 Resources & Documentation

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is created for educational purposes as part of a PLP MERN Stack Development assignment.

## 👨‍💻 Author

**RockieRaheem**

- GitHub: [@RockieRaheem](https://github.com/RockieRaheem)
- Assignment: Week 5 - Real-Time Communication with Socket.io

## 🙏 Acknowledgments

- PLP MERN Stack Development Program
- Socket.io team for the excellent real-time library
- React team for the amazing UI framework
- All open-source contributors

## 📞 Support

For questions or issues:

1. Check existing GitHub issues
2. Review Socket.io documentation
3. Consult React documentation
4. Contact via GitHub

---

**⭐ If you found this project helpful, please give it a star!**

**Made with ❤️, ☕, and lots of Socket.io events**

- Starter code for both client and server:
  - Basic project structure
  - Socket.io configuration templates
  - Sample components for the chat interface

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser
- Basic understanding of React and Express

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete both the client and server portions of the application
2. Implement the core chat functionality
3. Add at least 3 advanced features
4. Document your setup process and features in the README.md
5. Include screenshots or GIFs of your working application
6. Optional: Deploy your application and add the URLs to your README.md

## Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Building a Chat Application with Socket.io](https://socket.io/get-started/chat)
