"use strict";
 var http = require('http');

/*
*
* @params: de momento ninguno, en un futuro la ciudad sobre la que realizar la petición
* @return: string - a message
*/
function callweather(ciudadT,fromPostback){
  var ciudad = "Bilbao"; //temporal// ciudad = ciudadT
  /*if(fromPostback){ NO si fromPostback la ciudad que venga en el parámetro ciudadT será la guardada en memoria.
    ciudad = ciudadGuardadaEnMemoriaParaElUser;
  }*/
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
      });
 
      }).on("error", (err) => {
        reject("Error: " + err.message);
      });
 
  }).then(function(response){
    var datosApi = [];
    
    for(var i=0;i<3;i++){
      var obj = "";
      obj += "Día "+ (i+1) +": ";
      obj += parseInt((response.list[i].main.temp))-273,15;
      obj += " Cº, con tiempo " + response.list[i].weather[0].main;
      datosApi.push(obj);
    }
    message = datosApi;
    arrMessages.push(message);
    if(!fromPostback){
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Deseas establecer "+ciudad+" como tu ciudad por defecto?",
              "subtitle": "Para poder informarte del tiempo más rápido",
              "image_url": "/public/skyline.png",
              "buttons": [
                {
                  "type": "postback",
                  "title": "Si!",
                  "payload": "yes",
                },
                {
                  "type": "postback",
                  "title": "No!",
                  "payload": "no",
                }
              ],
            }]
          }
        } 
      }
      arrMessages.push(response);
    }
    return arrMessages;
  }).catch(function(result){
    message = "Wops, algo ha cascado...";
    console.log(result);
    return message; //mensaje de error
  });
  return promesa;
}
function processMessage(){
  var promesa = new Promise(function(resolve,reject){
    resolve("mensaje debería procesarse");
  });
  return promesa; 
}
module.exports = {
  processMessage : processMessage,
  callWeather : callweather
}