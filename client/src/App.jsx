import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("typing", ({ user, isTyping }) => {
      if (user) {
        setIsTyping(isTyping ? `${user} is typing...` : "");
      }
    });

    socket.on("userList", (usersList) => setUsers(usersList));

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("userList");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
      setIsTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (username) {
      socket.emit("typing", {
        user: username,
        isTyping: e.target.value.length > 0,
      });
    }
  };

  const joinChat = () => {
    if (username.trim()) {
      socket.emit("join", username);
      setHasJoined(true);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      {!hasJoined ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Enter Your Name</h2>
          <input
            type="text"
            className="w-full px-4 py-2 mb-4 text-black rounded-lg"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
            onClick={joinChat}
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Chat Room</h2>

          {/* Message List */}
          <div className="h-72 overflow-y-auto p-3 bg-gray-700 rounded-lg mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.user === username
                    ? "bg-blue-500 self-end text-white"
                    : "bg-gray-600"
                }`}
              >
                <strong>{msg.user}</strong> {msg.text}
              </div>
            ))}
          </div>

          {/* Typing Indicator */}
          {isTyping && <p className="text-gray-400">{isTyping}</p>}

          {/* Input Box */}
          <div className="flex">
            <input
              type="text"
              className="flex-1 px-4 py-2 text-black rounded-l-lg"
              placeholder="Type a message..."
              value={message}
              onChange={handleTyping}
            />
            <button
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-r-lg"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>

          {/* Active Users */}
          <h3 className="text-lg font-bold mt-4">Active Users</h3>
          <ul className="bg-gray-700 p-3 rounded-lg">
            {users.map((user, index) => (
              <li key={index} className="text-gray-300">
                {user}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
