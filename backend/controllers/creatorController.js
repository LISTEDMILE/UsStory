const Creation = require("../models/creationModel");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const Creator = require("../models/creatorModel");

/**
 * POST /creator/create
 * Create a new Creation with timeline + images
 */
exports.postCreateCreation = async (req, res) => {
  const uploadedPublicIds = [];
  try {
    /* ================= AUTH CHECK ================= */
    if (!req.session?.isLoggedIn || !req.session?._id) {
      return res.status(401).json({
        errors: ["Unauthorized. Please login first."],
      });
    }

    /* ================= INPUT ================= */
    let {
      recipientName,
      title,
      message,
      relationshipType,
      visibility,
      musicMood,
      theme,
      accentColor,
      closingNote,
      timeline,
      imageMomentIndex,
    } = req.body;
    let creationPass;

    if (visibility === "private") {
      if (!req.body.password) {
        return res.status(400).json({ errors: ["No password"] });
      }
      creationPass = req.body.password;
    }

    /* ================= PARSE TIMELINE ================= */
    if (timeline) {
      if (typeof timeline === "string") {
        timeline = JSON.parse(timeline);
      }
    } else {
      timeline = [];
    }

    if (!Array.isArray(timeline)) {
      return res.status(400).json({
        errors: ["Invalid timeline format."],
      });
    }

    /* ================= VALIDATION ================= */
    if (!recipientName || !title || !message || !relationshipType) {
      return res.status(400).json({
        errors: ["Required fields are missing."],
      });
    }

    if (recipientName.length > 50) {
      return res.status(400).json({
        errors: ["Recipient name must be under 50 characters."],
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        errors: ["Title must be under 100 characters."],
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        errors: ["Message must be under 2000 characters."],
      });
    }

    if (closingNote && closingNote.length > 300) {
      return res.status(400).json({
        errors: ["Closing note must be under 300 characters."],
      });
    }

    /* ================= NORMALIZE IMAGE INDEXES ================= */
    const imageIndexes = imageMomentIndex
      ? Array.isArray(imageMomentIndex)
        ? imageMomentIndex.map(Number)
        : [Number(imageMomentIndex)]
      : [];

    /* ================= CLOUDINARY UPLOAD ================= */

    if (req.files && req.files.length > 0) {
      const imageCountMap = {};

      imageIndexes.forEach((index) => {
        imageCountMap[index] = (imageCountMap[index] || 0) + 1;
      });

      for (const index in imageCountMap) {
        const existingCount = timeline[index]?.images?.length || 0;

        if (existingCount + imageCountMap[index] > 4) {
          return res.status(400).json({
            errors: ["Maximum 4 images allowed per moment"],
          });
        }
      }

      // Now upload
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const momentIndex = imageIndexes[i];

        if (!timeline[momentIndex]) continue;

        const upload = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "usstory/timeline" },
        );

        uploadedPublicIds.push(upload.public_id);

        timeline[momentIndex].images ??= [];
        timeline[momentIndex].images.push({
          url: upload.secure_url,
          publicId: upload.public_id,
        });
      }
    }

    /* ================= CREATE ================= */
    const creation = new Creation({
      creator: req.session._id,

      recipientName,
      title,
      message,

      relationshipType,
      visibility: visibility || "public",

      musicMood: musicMood || null,
      theme: theme || null,
      accentColor: accentColor || null,

      closingNote,
      timeline,
    });

    if (creation.visibility === "private") {
      creation.password = creationPass;
    }

    await creation.save();
    await Creator.findByIdAndUpdate(req.session._id, {
      $push: { creations: creation._id },
    });

    /* ================= RESPONSE ================= */
    res.status(201).json({
      success: true,
      message: "Creation created successfully.",
      creationId: creation._id,
    });
  } catch (err) {
    console.error("Create Creation Error:", err);

    /* ================= ROLLBACK CLOUDINARY ================= */
    for (const publicId of uploadedPublicIds) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (e) {
        console.error("Cloudinary rollback failed:", e);
      }
    }

    res.status(500).json({
      errors: ["Failed to create creation."],
    });
  }
};

/**
 * GET /creator/my-creations
 * Returns minimal info for logged-in user's creations
 */
exports.getCreations = async (req, res) => {
  try {
    if (!req.session?.isLoggedIn || !req.session?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const creator = await Creator.findById(req.session._id).populate({
      path: "creations",
      select: "_id title recipientName",
      options: { sort: { createdAt: -1 } },
    });

    const creations = creator.creations;

    return res.status(200).json({
      success: true,
      creations,
    });
  } catch (error) {
    console.error("Get Creations Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch creations",
    });
  }
};

/**
 * POST /creator/creation/:creationId
 * Get a single creation (story view)
 */
exports.getSingleCreation = async (req, res) => {
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
        "title recipientName message relationshipType visibility musicMood visualMood accentColor closingNote timeline creator",
      )
      .lean();

    if (!creation) {
      return res.status(404).json({
        errors: ["Creation not found"],
      });
    }

    /* ================= VISIBILITY CHECK ================= */
    if (
      creation.visibility === "private" &&
      (!req.session?.isLoggedIn ||
        String(req.session._id) !== String(creation.creator))
    ) {
      return res.status(403).json({
        errors: ["This creation is private"],
      });
    }

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

exports.deleteCreation = async (req, res) => {
  try {
    /* ================= AUTH CHECK ================= */
    if (!req?.session?.isLoggedIn || !req?.session?._id) {
      return res.status(401).json({
        success: false,
        errors: ["Unauthorized Access"],
      });
    }

    const creationId = req.params.creationId;

    /* ================= FIND CREATION ================= */
    const creation = await Creation.findById(creationId).select("creator");

    if (!creation) {
      return res.status(404).json({
        success: false,
        errors: ["Creation not found"],
      });
    }

    /* ================= OWNERSHIP CHECK ================= */
    if (creation.creator.toString() !== req.session._id) {
      return res.status(403).json({
        success: false,
        errors: ["Unauthorized Access"],
      });
    }

    /* ================= DELETE CREATION ================= */
    await Creation.findByIdAndDelete(creationId);

    /* ================= REMOVE FROM CREATOR ARRAY ================= */
    await Creator.findByIdAndUpdate(req.session._id, {
      $pull: { creations: creationId },
    });

    return res.status(200).json({
      success: true,
      message: "Creation deleted successfully",
    });
  } catch (err) {
    console.error("Delete Creation Error:", err);
    return res.status(500).json({
      success: false,
      errors: ["Failed to delete creation"],
    });
  }
};

exports.getEditFetch = async (req, res) => {
  try {
    /* ================= AUTH CHECK ================= */
    if (!req?.session?.isLoggedIn || !req?.session?._id) {
      return res.status(401).json({
        success: false,
        errors: ["Unauthorized Access"],
      });
    }

    const creationId = req.params.creationId;

    const creation = await Creation.findById(creationId).select(
      "recipientName title message relationshipType visibility musicMood theme accentColor closingNote timeline creator password",
    );

    if (!creation) {
      return res.status(404).json({
        success: false,
        errors: ["Creation not found"],
      });
    }

    /* ================= OWNERSHIP CHECK ================= */
    if (creation.creator.toString() !== req.session._id) {
      return res.status(403).json({
        success: false,
        errors: ["Unauthorized Access"],
      });
    }

    /* ================= RETURN DATA ================= */
    return res.status(200).json({
      success: true,
      creation,
    });
  } catch (err) {
    console.error("Delete Creation Error:", err);
    return res.status(500).json({
      success: false,
      errors: ["Failed to delete creation"],
    });
  }
};

exports.putUpdateCreation = async (req, res) => {
  const uploadedPublicIds = [];

  try {
    if (!req?.session?.isLoggedIn || !req?.session?._id) {
      return res.status(401).json({
        errors: ["Unauthorized Access"],
      });
    }
    const { creationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(creationId)) {
      return res.status(400).json({ errors: ["Invalid creation ID"] });
    }

    const creation = await Creation.findById(creationId);
    if (!creation) {
      return res.status(404).json({ errors: ["Creation not found"] });
    }

    if (creation.creator.toString() !== req.session._id) {
      return res.status(401).json({
        errors: ["Unauthorized Access"],
      });
    }
    /* ================= PARSE BODY ================= */

    let {
      recipientName,
      title,
      message,
      relationshipType,
      visibility,
      musicMood,
      visualMood,
      accentColor,
      closingNote,
      timeline,
    } = req.body;

    if (typeof timeline === "string") {
      timeline = JSON.parse(timeline);
    }

    if (!Array.isArray(timeline)) {
      return res.status(400).json({ errors: ["Invalid timeline format"] });
    }

    /* ================= PARSE IMAGE INDEXES ================= */

    const imageIndexes = req.body.imageMomentIndex
      ? Array.isArray(req.body.imageMomentIndex)
        ? req.body.imageMomentIndex.map(Number)
        : [Number(req.body.imageMomentIndex)]
      : [];

    /* ================= DELETE REMOVED IMAGES ================= */

    const oldPublicIds = creation.timeline.flatMap((item) =>
      item.images.map((img) => img.publicId).filter(Boolean),
    );

    const newPublicIds = timeline.flatMap((item) =>
      (item.images || []).map((img) => img.publicId).filter(Boolean),
    );

    const removedPublicIds = oldPublicIds.filter(
      (id) => !newPublicIds.includes(id),
    );

    await Promise.all(
      removedPublicIds.map((id) => cloudinary.uploader.destroy(id)),
    );

    /* ================= VALIDATE IMAGE LIMIT ================= */

    if (req.files && req.files.length > 0) {
      const imageCountMap = {};

      imageIndexes.forEach((index) => {
        imageCountMap[index] = (imageCountMap[index] || 0) + 1;
      });

      for (const index in imageCountMap) {
        const originalMoment = creation.timeline[index];
        const existingCount = originalMoment?.images?.length || 0;

        if (existingCount + imageCountMap[index] > 4) {
          return res.status(400).json({
            errors: ["Maximum 4 images allowed per moment"],
          });
        }
      }

      /* ================= UPLOAD NEW IMAGES ================= */

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const momentIndex = imageIndexes[i];

        if (!timeline[momentIndex]) continue;

        const upload = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "usstory/timeline" },
        );

        uploadedPublicIds.push(upload.public_id);

        timeline[momentIndex].images ??= [];
        timeline[momentIndex].images.push({
          url: upload.secure_url,
          publicId: upload.public_id,
        });
      }
    }

    /* ================= UPDATE FIELDS ================= */

    creation.recipientName = recipientName;
    creation.title = title;
    creation.message = message;
    creation.relationshipType = relationshipType;
    creation.visibility = visibility || "public";
    creation.musicMood = musicMood || null;
    creation.visualMood = visualMood || "warm";
    creation.accentColor = accentColor || null;
    creation.closingNote = closingNote || null;

    creation.timeline = timeline;

    if (creation.visibility === "private") {
      if (!req.body.password) {
        return res.status(400).json({ errors: ["Password required"] });
      }
      creation.password = req.body.password;
    }

    await creation.save();

    return res.json({
      success: true,
      message: "Creation updated successfully",
    });
  } catch (err) {
    console.error("Update Creation Error:", err);

    /* ================= ROLLBACK UPLOADS ================= */

    for (const publicId of uploadedPublicIds) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (e) {
        console.error("Rollback failed:", e);
      }
    }

    return res.status(500).json({
      errors: ["Failed to update creation"],
    });
  }
};
