"use strict";
const weather = require("./weather");

//de momento no hacemos uso de userPsid
function checkCommand(userPsid,command, arguments){
  var response = "";
  var promesa = Promise.resolve("command not recognised");
  if(command === "weather"){
    promesa = weather.callWeather(arguments,false);
  }
  return promesa;
  /*
  return promesa.then(function(response){
    return response;
  }).catch(function(result){
    return "something weird happened: "+ result;
  });*/
}

function processMessage(userPsid, message){
  var response = "";
  var promesa = Promise.resolve("message not supported");
  if(message === "Si"){
    promesa = weather.processMessage();
  }
  return promesa;
}

function handlePostback(userPsid, received_postback){
  var response = "";
  var promesa = Promise.resolve("postback not recognised");
  if(received_postback.payload === "Si"){
    promesa = weather.callWeather(arguments,true);
  }
  return promesa;
}


module.exports = {
  checkCommand : checkCommand,
  handlePostback : handlePostback
}