import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
  const wsUrl = process.env.REACT_APP_WS_URL || "http://localhost:8080";
  
  try {
    const socket = new SockJS(`${wsUrl}/ws`);

    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 0, // ✅ auto reconnect band karo

      onConnect: () => {
        console.log("Connected ✅");
        stompClient.subscribe("/topic/messages", (message) => {
          const body = JSON.parse(message.body);
          onMessageReceived(body);
        });
      },

      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"]);
        // ❌ app crash nahi hogi
      },

      onWebSocketError: (error) => {
        console.error("WebSocket error - backend not available:", error);
        // ❌ app crash nahi hogi
      },

      onDisconnect: () => {
        console.log("Disconnected ❌");
      },
    });

    stompClient.activate();
  } catch (error) {
    console.error("WebSocket init failed:", error);
    // ❌ app crash nahi hogi
  }
};

export const sendMessage = (msg) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(msg),
    });
  } else {
    console.error("WebSocket not connected ❌");
  }
};