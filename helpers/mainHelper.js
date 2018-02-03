"use strict";
const weather = require("./weather");

function checkCommand(command, argument){
  var response = "";
  var promesa = Promise.resolve("command not recognised");
  if(command === "weather"){
    promesa = weather.callWeather();//pasar el argumento
  }
  
  
  return promesa.then(function(response){
    return response;
  }).catch(function(result){
    return "something weird happened: "+ result;
  });
}

module.exports = {
  checkCommand : checkCommand
}