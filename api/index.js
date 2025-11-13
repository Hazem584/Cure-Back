const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");   // <<< مهم جدًا
const port = process.env.PORT || 3000;
const URL = process.env.DB_URL;

const appointmentsRoutes = require("../routes/appointments");
const doctorsRouter = require("../routes/doctors");
const userRoutes = require("../routes/user");
const mongoose = require("mongoose");
const authRoutes = require("../routes/auth");
const usersRoutes = require("../routes/user");

const allowedOrigins = [
  "http://localhost:5173",
  "https://cure-web.vercel.app",  
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/appointments", appointmentsRoutes);
app.use("/api/v1/doctors", doctorsRouter);
app.use("/api/v1/user", userRoutes);

app.use((req, res) => {
  res.status(404).send({
    message: "This is an invalid route",
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
  console.log(`Server listening on port ${port}`);
});
