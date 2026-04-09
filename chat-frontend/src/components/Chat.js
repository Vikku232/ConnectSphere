import React, { useState, useEffect } from "react";
import { connectWebSocket, sendMessage } from "../services/websocket";

const Chat = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  // 🔥 Connect WebSocket only once
  useEffect(() => {
    connectWebSocket((msg) => {
      setMessages((prev) => [...prev, msg]); // only here add message
    });
  }, []);

  const handleJoin = () => {
    if (currentUser.trim() === "") return;
    setJoined(true);
  };

  const handleSend = () => {
    if (message.trim() === "") return;

    const msg = {
      sender: currentUser,
      content: message,
    };

    sendMessage(msg); // ❌ yaha setMessages nahi karna
    setMessage("");
  };

  // 🔹 Join Screen
  if (!joined) {
    return (
      <div
        style={{
          backgroundColor: "#0f172a",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Enter Username</h2>
          <input
            type="text"
            placeholder="Your name..."
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
            style={{
              padding: "8px",
              marginRight: "5px",
              borderRadius: "5px",
              border: "none",
            }}
          />
          <button onClick={handleJoin}>Join</button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <div
        style={{
          width: "350px",
          backgroundColor: "#1e293b",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Chat App</h2>

        {/* Messages */}
        <div
          style={{
            height: "300px",
            overflowY: "auto",
            padding: "10px",
          }}
        >
          {messages.map((msg, index) => {
            const isMyMessage = msg.sender === currentUser;

            return (
              <div
                key={index}
                style={{
                  textAlign: isMyMessage ? "right" : "left",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: isMyMessage ? "#38bdf8" : "#334155",
                    color: isMyMessage ? "black" : "white",
                    padding: "6px 10px",
                    borderRadius: "10px",
                    maxWidth: "70%",
                    wordWrap: "break-word",
                  }}
                >
                  <b>{msg.sender}:</b> {msg.content}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div style={{ display: "flex" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              marginRight: "5px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          <button
            onClick={handleSend}
            style={{
              backgroundColor: "#38bdf8",
              color: "black",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              boxShadow: "2px 2px 6px black",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;