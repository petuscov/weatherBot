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


const bot = new BootBot({
  accessToken: PAGE_ACCESS_TOKEN,
  verifyToken: PAGE_ACCESS_TOKEN,
  appSecret: FB_APP_SECRET 
});

bot.hear("ping",(payload,chat)=>{
  chat.say('pong');
});

bot.hear(basicArrays.ayuda,(payload,chat)=>{
  chat.say("Say 'weather' if you want to know weather for a specific city");
});

const conversation = (convo) => {
  var city = convo.get('city'); //¿almacenar par usuario - ciudad en mysql? 
  if(city){
    mainRoute.mainConversation(convo);
  }else{
    mainRoute.askForCity(convo);
  }
}

bot.hear(basicArrays.start,(payload,chat)=>{
  var message = "Hi, say 'help' for a list of what i can do";
  var options = { typing: true };
  chat.say(message, options)
});



const initMenu = (payload, chat) => {
  chat.conversation(conversation);
};

bot.hear(basicArrays.tiempo,initMenu);

bot.on('message', (payload, chat) => {//TODO checking
  console.log(chat);//comprobar si el mensaje ya ha sido capturado por otra suscripción. (.captured)
});

//En el servidor usamos una versión modificada (por nosotros) del framework bootbot.
bot.start("3000",certificate,privateKey); 

module.exports = {
  bot:bot
}