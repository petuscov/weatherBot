"use strict";
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
    $.ajax({url:direccion,
      xhrFields: {
        withCredentials: true
     },
      //dataType: 'jsonp',
      done:function(result){
        var datosApi = "";

        for(var i=0;i<3;i++){
          datosApi += "Día "+ (i+1) +": ";
            datosApi += parseInt(JSON.stringify(result.list[i].main.temp))-273,15;
            datosApi += " Cº, con tiempo " + JSON.stringify(result.list[i].weather[0].main) + "<br>";
        }
        resolve(datosApi);
     },
     fail:function(result){
       reject(result);
     },
     error: function(xhr, status, error) {
       reject(error);
     },
  });
  }).then(function(response){

    message = response;
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