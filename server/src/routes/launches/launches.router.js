const express = require("express");
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpRemoveLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpRemoveLaunch);

module.exports = { launchesRouter };
