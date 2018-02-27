"use strict";
 var http = require('http');
/*
*
* @params: string - la ciudad sobre la que realizar la petición
* @return: string - a message
*/
function weather(ciudadT){
  var ciudad = "Bilbao"; //temporal// ciudad = ciudadT
  var direccion = "http://api.openweathermap.org/data/2.5/forecast?q="+ciudad+"&cnt=3&&APPID=e8638bc5d9a41ddc3c698bf4eba969a0";
  var arrMessages = [];
  var message = "";
  var promesa = new Promise(function(resolve,reject){
    http.get(direccion, (resp) => {
      var data = '';
 
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
 
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(JSON.parse(data));
        console.log("ended");
      });
 
    }).on("error", (err) => {
      reject("Error: " + err.message);
    });
 
  });
  promesa = promesa.then(function(response){
    var datosApi = [];
    
    for(var i=0;i<3;i++){
      var obj = "";
      obj += "Día "+ (i+1) +": ";
      obj += parseInt((response.list[i].main.temp))-273,15;
      obj += " Cº, con tiempo " + response.list[i].weather[0].main;
      datosApi.push(obj);
    }
    message = datosApi;
    
    return Promise.resolve(message);
  }).catch(function(result){
    message = "Wops, algo ha cascado...";
    console.log(result);
    return message; //mensaje de error
  });
  return promesa;
}
module.exports = {
  weather : weather
}