const mongoose = require("mongoose");
const Creation = require("./creationModel");

const creatorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    creations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Creation",
      },
    ],
  },
  { timestamps: true },
);
/* =========================================================
   CASCADE DELETE: Delete all creations when creator is deleted
   ========================================================= */

/**
 * Case 1: creator.remove()
 */
creatorSchema.pre("remove", async function (next) {
  try {
    await Creation.deleteMany({ creator: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Case 2: Creator.findByIdAndDelete() / findOneAndDelete()
 */
creatorSchema.pre("findOneAndDelete", async function (next) {
  try {
    const creator = await this.model.findOne(this.getFilter());

    if (creator) {
      await Creation.deleteMany({ creator: creator._id });
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Creator", creatorSchema);
