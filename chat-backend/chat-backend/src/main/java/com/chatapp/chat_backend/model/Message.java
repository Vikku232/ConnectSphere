package com.chatapp.chat_backend.model;

import lombok.Data;

@Data
public class Message {
    private String sender;
    private String content;
}