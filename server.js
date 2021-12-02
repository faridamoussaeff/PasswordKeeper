// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//      The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(express.urlencoded ({extended: false}));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

//Separated Routes for each Resource
//Note: Feel free to replace the example routes below with your own
const indexRouter = require('./routes/index');
const usersRoutes = require('./routes/users');
const logoutRouter = require('./routes/logout');


//Mount all resource routes
//Note: Feel free to replace the example routes below with your own
app.use('/', indexRouter);
app.use('/users', usersRoutes);
app.use('/logout', logoutRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

