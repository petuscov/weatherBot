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
  mainRoute = require("/routes/mainRoute.js");


const bot = new BootBot({
  accessToken: PAGE_ACCESS_TOKEN,
  verifyToken: PAGE_ACCESS_TOKEN,
  appSecret: FB_APP_SECRET 
});

bot.module(mainConversation);

bot.hear("ping",(payload,chat)=>{
  chat.say('pong');
});

conversation = (convo) => {
  city = convo.get('city'); //almacenar par usuario - ciudad en mysql? 
  if(city){
    mainRoute.mainConversation(convo);
  }else{
    mainRoute.askForCity(convo);
  }
}

//En el servidor usamos una versión modificada (por nosotros) del framework bootbot.
bot.start("3000",certificate,privateKey); 

module.exports = {
  bot:bot
}