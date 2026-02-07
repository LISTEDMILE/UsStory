const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");

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
      images: [{ url: String ,publicId:String}],
    },
  ],

  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },

  musicMood: {
      type: String,
    default:"romantic"
  },

  relationshipType: {
    type: String,
   
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



creationSchema.pre("findOneAndDelete", async function () {
  const creation = await this.model.findOne(this.getFilter());
  if (!creation) return;

  for (const item of creation.timeline) {
    for (const image of item.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }
  }
});



module.exports = mongoose.model("Creation", creationSchema);
