"use strict";
const weather = require("./weather");

function checkCommand(command, argument){
  if(command === "weather"){
    weather.callWeather();//pasar el argumento
    console.log(command +" , "+ argument);
  }
}

module.exports = {
  checkCommand : checkCommand
}