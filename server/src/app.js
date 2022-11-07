const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const app = express();
const api = require("./routes/api");

//?MIDDLEWARE
app.use(
  cors({
    origin: "http://localhost:3000",
  })
); //Allows us to make requests from the client to the server and allow cross-origin requests

app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
