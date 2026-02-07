const Creation = require("../models/creationModel");
const mongoose = require("mongoose");

exports.getIsPrivate = async (req, res) => {
  try {
    const { creationId } = req.params;

    /* ================= VALIDATE ID ================= */
    if (!mongoose.Types.ObjectId.isValid(creationId)) {
      return res.status(400).json({
        errors: ["Invalid creation ID"],
      });
    }

    const creation = await Creation.findById(creationId).select("visibility");

    if (!creation) {
      return res.status(404).json({
        errors: ["Creation not found"],
      });
    }

    res.status(200).json({
      visibility: creation.visibility,
    });
  } catch (err) {
    console.error(err);
    return res.status(501).json({ errors: ["Internal Server Error"] });
  }
};

/**
 * POST /creator/creation/:creationId
 * Get a single creation (story view)
 */
exports.getSingleCreationViewer = async (req, res) => {
  try {
    const { creationId } = req.params;

    /* ================= VALIDATE ID ================= */
    if (!mongoose.Types.ObjectId.isValid(creationId)) {
      return res.status(400).json({
        errors: ["Invalid creation ID"],
      });
    }

    /* ================= FETCH ================= */
    const creation = await Creation.findById(creationId)
      .select(
        "title recipientName message relationshipType visibility musicMood visualMood accentColor closingNote timeline creator password",
      )
      .lean();
    if (!creation) {
      return res.status(404).json({
        errors: ["Creation not found"],
      });
    }

    if (creation.visibility === "private") {
      if (!req.body.password || creation.password !== req.body.password) {
        return res.status(403).json({
          errors: ["Unauthorized Access"],
        });
      }
    }
    delete creation.password;

    /* ================= RESPONSE ================= */
    res.status(200).json({
      success: true,
      creation,
    });
  } catch (err) {
    console.error("Get Creation Error:", err);
    res.status(500).json({
      errors: ["Failed to fetch creation"],
    });
  }
};
