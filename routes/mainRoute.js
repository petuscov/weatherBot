"use strict";
const weatherAPI = require("./helpers/weather.js").weather;
const arrays = require("./helpers/basicArrays.js");
const store = require("./helpers/store.js");
const translations = require("./helpers/translations.js");
const options = { typing: true };

var mainConv = (convo,city) => {  
    var language = store.getData(payload.sender.id).language || "EN";
    const question = () => {
      convo.sendGenericTemplate([{
        title: city,
        subtitle: translations[language].questionSettedCity + city +"?",
        image_url: "https://bots.ikasten.io:3001/skyline.png",//"./../public/skyline.png",
        buttons: [
          { type: 'postback', title: translations[language].yes, payload: 'si' },
          { type: 'postback', title: translations[language].no, payload: 'no' }
        ]
      }]);
    };
    const answer = (payload, convo) => {
      var text = "";
      if (!payload.message && !payload.postback){convo.end();}
      if (payload.message){
        text = payload.message.text.toLowerCase();
      }else{
        text = payload.postback.payload;
      }
      var fin = arrays.cancel.find(function(element){return element===text});
      if (fin){
        convo.end();
      }
      var si = arrays.si.find(function(element){return element===text});
      if(si){
        weatherAPI(city)
        .then(function(response){
          convo.say(response,options).then(()=>{
            guardarCiudad(convo,city);
          });
        })
        .catch(function(err){
        convo.say(translations[language].error,options).then(()=>{
          convo.say("D:").then(()=>{
            convo.end();
          });
        });
      });
      }else{
        var no = arrays.no.find(function(element){return element===text});
        if(no){
          convo.say(translations[language].ok,options).then(()=>{
            askForCity(convo);
          });
        }else{
          convo.say(translations[language].toExitConv,options);
        }
      }
    };
    convo.ask(question, answer);
};


var askForCity = (convo) =>{
  var language = store.getData(payload.sender.id).language || "EN";
  const question = () => {
    convo.say(translations[language].mainQuestion,options);
  };

  const answer = (payload, convo) => {
    if (!payload.message){convo.end();}
    var text = payload.message.text.toLowerCase();
    var fin = arrays.cancel.find(function(element){return element===text});
    if (fin){
      convo.end();
    }
    var city = text;
    var promesa = weatherAPI(city)
      .then(function(response){
       /*convo.say(response[0],options).then(()=>{
        convo.say(response[1],options).then(()=>{
          convo.say(response[2],options).then(()=>{
            guardarCiudad(convo,city);
          });
        });
       });*/
        convo.say(response,options).then(()=>{
          guardarCiudad(convo,city);
        });
      })
      .catch(function(err){
        convo.say(city + translations[language].notValidCity,options).then(()=>{
          askForCity(convo);
        });
      });
  };
  convo.ask(question, answer);
}

var guardarCiudad = (convo,city)=>{
   var language = store.getData(payload.sender.id).language || "EN";
   const question = () => {
    convo.say({
      text:translations[language].saveCity,
      buttons: [
        { type: 'postback', title: translations[language].yes, payload: 'yes' },
        { type: 'postback', title: translations[language].no, payload: 'no' }
      ]
    },options);
  };

  const answer = (payload, convo) => {
    var text = "";
    if (!payload.message && !payload.postback){convo.end();}
    if (payload.message){
      text = payload.message.text.toLowerCase();
    }else{
      //console.log(payload);
      text = payload.postback.payload;
    }
  
    var fin = arrays.cancel.find(function(element){return element===text});
    if (fin){
      convo.end();
    }
    var si = arrays.si.find(function(element){return element===text});
    if(si){
      convo.say(translations[language].savedCity1+ city +translations[language].savedCity2,options).then(()=>{
        var obj = store.getData(convo.userId);
        obj = Object.assign(obj || {},{
          city: city
        });
        store.setData(convo.userId,obj); 
        convo.end();
      });
    }else{
      var no = arrays.no.find(function(element){return element===text});
      if(no){
        convo.say(translations[language].ok,options).then(()=>{
          convo.end();
        });
      }else{
        convo.say(translations[language].toExitConv,options).then(()=>{
          guardarCiudad(convo);
        });
      }
    }
  };
  if(store.getData(convo.userId)){
    if(store.getData(convo.userId).city!==city){
      convo.ask(question, answer);
    }else{
      convo.end();
    }
  }else{
    convo.ask(question, answer);
  }
}

module.exports = {
  mainConversation : mainConv,
  askForCity: askForCity
};