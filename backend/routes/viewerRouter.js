const express = require("express");
const viewerController = require("../controllers/viewerController");
const viewerRouter = express.Router();

viewerRouter.get("/isPrivate/:creationId", viewerController.getIsPrivate);
viewerRouter.post(
  "/creation/:creationId",
  viewerController.getSingleCreationViewer,
);

module.exports = viewerRouter;
