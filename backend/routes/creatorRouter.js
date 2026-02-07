const express = require("express");
const creatorController = require("../controllers/creatorController");
const creatorRouter = express.Router();
const upload = require("../utils/uploads");

creatorRouter.post(
  "/create",
  upload.any(), // timeline images come as multipart/form-data
  creatorController.postCreateCreation,
);
creatorRouter.post(
  "/creation/:creationId",
  creatorController.getSingleCreation,
);
creatorRouter.get("/creations", creatorController.getCreations);
creatorRouter.delete("/delete/:creationId", creatorController.deleteCreation);
creatorRouter.get("/editFetch/:creationId", creatorController.getEditFetch);
creatorRouter.put(
  "/update/:creationId",
  upload.array("images"),
  creatorController.putUpdateCreation,
);
module.exports = creatorRouter;
