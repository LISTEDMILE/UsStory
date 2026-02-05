const express = require("express");
const creatorController = require("../controllers/creatorController");
const creatorRouter = express.Router();
const upload = require("../utils/uploads");

creatorRouter.post(
  "/create",
  upload.any(), // timeline images come as multipart/form-data
  creatorController.postCreateCreation
);
creatorRouter.post(
  "/creation/:creationId",
  creatorController.getSingleCreation
);

module.exports = creatorRouter;