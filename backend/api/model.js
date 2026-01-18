const { response } = require("express");
const mongoose = require("mongoose");

// Message Schema - Individual messages in a conversation
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["user", "assistant"],
  },
  content: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Chat Schema - Complete conversation with multiple messages
const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  messages: {
    type: [messageSchema],
    default: [],
  },
  responses: {
    type: [{ message: messageSchema, related1: String, related2: String }],
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
module.exports = Chat;
