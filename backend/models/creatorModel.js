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
 * Case 1: Creator.findByIdAndDelete() / Creator.findOneAndDelete()
 */
creatorSchema.pre("findOneAndDelete", async function () {
    const creator = await this.model.findOne(this.getFilter());

    if (creator) {
        const creations = await Creation.find({ creator: creator._id });

        for (const creation of creations) {
            await Creation.findByIdAndDelete(creation._id);
        }
    }
});

module.exports = mongoose.model("Creator", creatorSchema);
