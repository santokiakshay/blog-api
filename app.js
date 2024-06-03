const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 3000;
const connectToDb = require('./config/mongo.connection');

const app = new express();
const routes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectToDb();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// seed data load
require("./scripts/seedData").initSeedData();

app.use("/api", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.send("Route not found");
});

app.listen(port);