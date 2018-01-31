"use strict";
 var http = require('http');

/*
*
* @params: de momento ninguno, en un futuro la ciudad sobre la que realizar la petición
* @return: string - a message
*/
function callweather(){
  var ciudad = "Bilbao"; //temporal
  var direccion = "http://api.openweathermap.org/data/2.5/forecast?q="+ciudad+"&cnt=3&&APPID=e8638bc5d9a41ddc3c698bf4eba969a0";
  var message = "";
  var promesa = new Promise(function(resolve,reject){
    http.get(direccion, (resp) => {
      let data = '';
 
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
 
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(JSON.parse(data));
      });
 
      }).on("error", (err) => {
        reject("Error: " + err.message);
      });
 
  }).then(function(response){
    var datosApi = [];
    
    for(var i=0;i<3;i++){
      var obj = "";
      obj += "Día "+ (i+1) +": ";
      obj += parseInt(JSON.stringify(response.list[i].main.temp))-273,15;
      obj += " Cº, con tiempo " + JSON.stringify(response.list[i].weather[0].main);
      datosApi.push(obj);
    }
    message = datosApi;
    console.log(message);
    return message;
  }).catch(function(result){
    message = "Wops, algo ha cascado...";
    console.log(result);
    return message; //mensaje de error
  });
  
}

module.exports = {
  callWeather : callweather
}