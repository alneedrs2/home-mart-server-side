const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("home is running waiting for mart");
});

app.listen(port, () => {
  console.log("homeMart is running on port", port);
});
