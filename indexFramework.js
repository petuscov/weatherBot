"use strict";
require('dotenv').config();

// Imports dependencies and set up http server
const
  express = require('express'),
  app = express().use(bodyParser.json()), // creates express http server
  BootBot = require('bootbot'),
  bodyParser = require('body-parser'),
  fs = require('fs'), 
  privateKey = fs.readFileSync('privkey.pem'),
  certificate = fs.readFileSync('fullchain.pem'),
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
  //todo = require("./routes/todo"),


const bot = new BootBot({
  accessToken: PAGE_ACCESS_TOKEN,
  verifyToken: PAGE_ACCESS_TOKEN,
  appSecret: 'FB_APP_SECRET' //TODO
});

//TODO todo.