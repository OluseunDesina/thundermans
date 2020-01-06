// import express from 'express';
// import logger from 'morgan';
// import bodyParser from 'body-parser';
const path = require("path");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/config");

const app = express();
mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://seun:u176CB7h4waFJqmV@cluster0-cwm4l.mongodb.net/better-guy?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log(`connected to DB`);
  })
  .catch(err => {
    console.log(`error connecting to Database`);
    console.log(err);
  });

// mongoose
//   .connect(config.db, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log(`connected to DB`);
//   })
//   .catch(err => {
//     console.log(`error connecting to Database`);
//     console.log(err);
//   });

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

const corOptions = {
  origin: "*",
  credentials: "true",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corOptions));

app.use(logger("combined"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use("/images", express.static(path.join("backend/images")));

app.use("/api/posts", postRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
