const mongoose = require("mongoose");

const creationSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
    required: true,
    index: true,
  },

  recipientName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },

  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },

  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },

  timeline: [
    {
      title: String,
      description: String,
      date: Date,
      images: [{ url: String }],
    },
  ],

  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },

  musicMood: {
      type: String,
      enum: ["romantic", "happy", "calm", "nostalgic"],
    
  },

  relationshipType: {
    type: String,
    enum: [
      "friend",
      "best-friend",
      "love",
      "family",
      "mentor",
      "colleague",
      "custom",
    ],
    required: true,
  },

  visualMood: {
      type: String,
      enum: ["dark", "light", "pastel", "warm"],
      default: "warm",
  },
  closingNote: {
    type: String,
    maxlength: 300,
  },
  password: {
    type: String,
  },
  accentColor: {
    type:String,
  }
});

module.exports = mongoose.model("Creation", creationSchema);
