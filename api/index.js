const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const URL = process.env.DB_URL;
app.use(express.json());
mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use((req, res) => {
  res.status(404).send({
    message: "This is a invalid route",
    data: null,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: err.message || "Internal Server Error",
    data: null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
