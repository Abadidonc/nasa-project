const { getAllPlanets } = require("../../models/planets.model");

async function httpGetAllPlanets(req, res) {
  return res.status(200).json(await getAllPlanets()); //status 200 is the default status
}

module.exports = { httpGetAllPlanets };
