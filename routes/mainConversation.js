"use strict";
const weatherAPI = require("routes/helpers/weather.js");
const arrays = require("routes/helpers/basicArrays.js");
const options = { typing: true };
var mainConv = (convo) => {  
  if(convo.get('city')){
    var city = convo.get('city');
    question = () => (
      convo.sendGenericTemplate([{
        title: city,
        subtitle: "Do you want to know weather for " + city +"?",
        image_url: "./public/skyline.jpg",
        buttons: ["Yes!","No"]
      }])
    );
    answer = (payload, convo) => {
      if (!payload.message) {convo.end();}
      var text = payload.message.text.toLowerCase();
      var fin = arrays.cancel.find(function(element){return element===text});
      if (fin){
        convo.end();
      }
      var si = arrays.si.find(function(element){return element===text});
      if(si){
        weatherAPI(city).then(function(response){
          convo.say(JSON.stringify(response),options).then(()=>{
            convo.end()
          });
        });
      }
      var no = arrays.no.find(function(element){return element===text});
      if(no){
        convo.say("Ok...",options).then(()=>{
          askForCity(convo);
        }
      }
      convo.say("humm... i dont understand you. Type 'cancel' to exit this beautiful conversation",options);
    };
  }
    convo.ask(question, answer);
  }

};


var askForCity = (convo) =>{

  const question = () => {
    convo.say("What city do you want to know weather for?",options);
  };

  const answer = (payload, convo) => {
    if (!payload.message){convo.end();}
    var text = payload.message.text.toLowerCase();
    var fin = arrays.cancel.find(function(element){return element===text});
    if (fin){
      convo.end();
    }
    weatherAPI(city).then(function(response){
      convo.say(JSON.stringify(response),options).then(()=>{
        guardarCiudad(convo,city);
      });
    }).catch(function(err){
      convo.say(city + " is not a valid city. Im sorry, try again...",options);
    });
  };
  convo.ask(question, answer);
}

var guardarCiudad = (convo,city)=>{
   const question = () => {
    convo.say("Do you want to save the city for future weather requests?",options);
  };

  const answer = (payload, convo) => {
    if (!payload.message){convo.end();}
    var text = payload.message.text.toLowerCase();
    var fin = arrays.cancel.find(function(element){return element===text});
    if (fin){
      convo.end();
    }
    var si = arrays.si.find(function(element){return element===text});
    if(si){
      weatherAPI(city).then(function(response){
        convo.set('city',city).then(()=>{
          convo.end()
        });
      });
    }
    var no = arrays.no.find(function(element){return element===text});
    if(no){
      convo.say("Ok...",options).then(()=>{
        convo.end()
      }
    }
    convo.say("humm... i dont understand you. Type 'cancel' to exit this exciting conversation",options);
  };
  convo.ask(question, answer);
}

module.exports = {
  mainConversation : mainConversation,
  askForCity: askForCity
};