"use strict";
const weatherAPI = require("./helpers/weather.js").weather;
const arrays = require("./helpers/basicArrays.js");
const store = require("./helpers/store.js");
const options = { typing: true };

var mainConv = (convo,city) => {  
 
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
        });
      }
      convo.say("humm... i dont understand you. Type 'cancel' to exit this beautiful conversation",options);
    };
    convo.ask(question, answer);
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
        convo.say(city + " is not a valid city. Im sorry, try again. (or say cancel to end this conversation)",options).then(()=>{
          askForCity(convo);
        });
      });
  };
  convo.ask(question, answer);
}

var guardarCiudad = (convo,city)=>{
   const question = () => {
    convo.say({
      text:"Do you want to save the city for future weather requests?",
      buttons: [
        { type: 'postback', title: 'Yes', payload: 'yes' },
        { type: 'postback', title: 'No', payload: 'no' }
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
      convo.say("Ok, I have saved "+ city +" as your city.",options).then(()=>{
        store[convo.userId] = Object.assign(store[convo.userId] || {},{
          city: city
        });
        convo.end();
      });
    }else{
      var no = arrays.no.find(function(element){return element===text});
      if(no){
        convo.say("Ok...",options).then(()=>{
          convo.end()
        });
      }else{
        convo.say("humm... i dont understand you. Type 'cancel' to exit this exciting conversation",options).then(()=>{
          convo.end();
        });
      }
    }
  };
  convo.ask(question, answer);
}

module.exports = {
  mainConversation : mainConv,
  askForCity: askForCity
};