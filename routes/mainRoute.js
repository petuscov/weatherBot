"use strict";
const weatherAPI = require("./helpers/weather.js").weather;
const arrays = require("./helpers/basicArrays.js");
const store = require("./helpers/store.js");
const options = { typing: true };

var mainConv = (convo,city) => {  
 
    const question = () => {
      convo.sendGenericTemplate([{
        title: city,
        subtitle: "Do you want to know weather for " + city +"?",
        image_url: "https://bots.ikasten.io:3001/skyline.png",//"./../public/skyline.png",
        buttons: [
          { type: 'postback', title: 'Yes!', payload: 'si' },
          { type: 'postback', title: 'No', payload: 'no' }
        ]
      }]);
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
        weatherAPI(city)
        .then(function(response){
          convo.say(response,options).then(()=>{
            guardarCiudad(convo);
          });
        })
        .catch(function(err){
        convo.say("Something went wrong...",options).then(()=>{
          convo.say("D:").then(()=>{
            convo.end();
          });
        });
      });
      }else{
        var no = arrays.no.find(function(element){return element===text});
        if(no){
          convo.say("Ok...",options).then(()=>{
            askForCity(convo);
          });
        }else{
          convo.say("humm... i dont understand you. Type 'cancel' to exit this beautiful conversation",options);
        }
      }
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
        var obj = store.getData(convo.userId);
        obj = Object.assign(obj || {},{
          city: city
        });
        store.update(convo.userId,obj); 
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
          guardarCiudad(convo);
        });
      }
    }
  };
  if(store.getData(convo.userId){
    if(store.getData(convo.userId).city!==city){
      convo.ask(question, answer);
    }
  }
}

module.exports = {
  mainConversation : mainConv,
  askForCity: askForCity
};