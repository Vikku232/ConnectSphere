import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),

    onConnect: () => {
      console.log("Connected ✅");

      stompClient.subscribe("/topic/messages", (message) => {
        const body = JSON.parse(message.body);
        console.log("Received:", body);
        onMessageReceived(body);
      });
    },

    onStompError: (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    },
  });

  stompClient.activate();
};

export const sendMessage = (msg) => {
  if (stompClient && stompClient.connected) {
    console.log("Sending:", msg);

    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(msg),
    });
  } else {
    console.error("WebSocket not connected ❌");
  }
};