const express = require("express");
const { httpGetAllPlanets } = require("./planets.controller");

const planetsRouter = express.Router();

//GET REQUEST
planetsRouter.get("/", httpGetAllPlanets);

module.exports = {
  planetsRouter,
};
