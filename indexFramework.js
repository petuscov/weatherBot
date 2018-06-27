"use strict";
require('dotenv').config();

// Imports dependencies and set up http server
const
  //express = require('express'),
  //app = express().use(bodyParser.json()), // creates express http server
  BootBot = require('bootbot'),
  //bodyParser = require('body-parser'),
  fs = require('fs'), 
  privateKey = fs.readFileSync('privkey.pem'),
  certificate = fs.readFileSync('fullchain.pem'),
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
  FB_APP_SECRET = process.env.FB_APP_SECRET;

//routes
const basicArrays = require("./routes/helpers/basicArrays.js");
const mainRoute = require("./routes/mainRoute.js");
const store = require("./routes/helpers/store.js");
const translations = require("./routes/helpers/translations.js");
const languageRoute = require("./routes/languageRoute.js");

const bot = new BootBot({
  accessToken: PAGE_ACCESS_TOKEN,
  verifyToken: PAGE_ACCESS_TOKEN,
  appSecret: FB_APP_SECRET 
});

//--------------------------------//

bot.hear("ping",(payload,chat)=>{
  chat.say('pong');
});

//start responses
bot.hear(basicArrays.startES,(payload,chat)=>{
  var userData = store.getData(payload.sender.id) || {};
  store.setData(payload.sender.id,Object.assign(userData||{},{language:"ES"}));
  var language = store.getData(payload.sender.id).language || "ES";
  var message = translations[language].hi;
  var options = { typing: true };
  chat.say(message, options)
});

bot.hear(basicArrays.startEN,(payload,chat)=>{
  var userData = store.getData(payload.sender.id) || {};
  store.setData(payload.sender.id,Object.assign(userData||{},{language:"EN"}));
  var language = store.getData(payload.sender.id).language || "EN";
  var message = translations[language].hi;
  var options = { typing: true };
  chat.say(message, options)
});

//help response
bot.hear(basicArrays.ayuda,(payload,chat)=>{
  var userInfo = store.getData(payload.sender.id);
  var language = userInfo ? userInfo.language || "EN" : "EN";
  chat.say(translations[language].help);
});

//main conversation
const conversation = (convo) => {
  var city = store.getData(convo.userId) ? store.getData(convo.userId).city : ""; 
  if(city){
    mainRoute.mainConversation(convo,city);
  }else{
    mainRoute.askForCity(convo);
  }
}
const initMenu = (payload, chat) => {
  chat.conversation(conversation);
};
bot.hear(basicArrays.tiempo,initMenu);

//language conversation
bot.hear(basicArrays.language,(payload,chat)=>{
  chat.conversation(languageRoute);
});

//default message
bot.on('message', (payload, chat, data) => {
  if(!data.captured){
    var userData = store.getData(payload.sender.id) || {};
    var language = userData.language || "EN";
    var message = translations[language].notHandled;
    var options = { typing: true };
    chat.say(message, options)
  };
});

//En el servidor usamos una versión modificada (por nosotros) del framework bootbot (para aceptar certificado y clave).
bot.start("3000",certificate,privateKey); 

////// For image serving.

var path = require('path');
var bodyParser = require('body-parser');
var https = require("https");
var express = require('express');
var app = express().use(bodyParser.json()); // creates express http server
app.get("/skyline.png", (req, res) => {
  res.sendFile(path.join(__dirname,"./public/skyline.png"));
});
app.get("/idioma.jpg", (req, res) => {
  res.sendFile(path.join(__dirname,"./public/idioma.jpg"));
});
https.createServer({
   key: privateKey,
   cert: certificate
}, app).listen("3001");

///////

module.exports = {
  bot:bot
}