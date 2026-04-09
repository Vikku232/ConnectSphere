package com.chatapp.chat_backend.controller;

import com.chatapp.chat_backend.model.Message;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat") // React se aayega
    @SendTo("/topic/messages") // sabko broadcast
    public Message sendMessage(Message message) {
        System.out.println("Message received: " + message.getContent());
        return message;
    }
}