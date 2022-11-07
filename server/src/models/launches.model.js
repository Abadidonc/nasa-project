// const launches = new Map();
const axios = require("axios");
const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) return;

  await populateLaunches();
}

async function populateLaunches() {
  console.log("Loading Launch Data ...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  response.data.docs.map((launchDoc) => {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload["customers"]);
    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
    saveLaunch(launch);
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne({}).sort("-flightNumber");

  if (!latestLaunch) return 100;

  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function existLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function addNewLaunch(launch) {
  const planet = await planets
    .findOne({})
    .where("keplerName")
    .equals(launch.destination);
  console.log("planet: ", planet);
  console.log("destination: ", launch.destination);
  if (!planet) {
    throw new Error("No matching planet found");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });
  saveLaunch(newLaunch);
  // launches.set(
  //   flightNumber,
  //   Object.assign(launch, {
  //     customer: ["Abadidonc", "NASA"],
  //     flightNumber: flightNumber,
  //     upcoming: true,
  //     success: true,
  //   })
  // );
}

async function removeLaunch(launchId) {
  const aborted = await launches.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  addNewLaunch,
  removeLaunch,
  existLaunchWithId,
};
