const http = require("http");
// const { start } = require("repl");
require("dotenv").config();

const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

//Doesn't conflict with the client port
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log("Listening on PORT:", PORT);
  });
}

startServer();
