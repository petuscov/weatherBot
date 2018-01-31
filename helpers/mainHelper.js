"use strict";
const weather = require("./weather");

function checkCommand(command, argument){
  var response = "";
  if(command === "weather"){
    response = weather.callWeather();//pasar el argumento
  }
  return response;
}

module.exports = {
  checkCommand : checkCommand
}