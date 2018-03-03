"use strict";
const store = require("./helpers/store.js");
const translations = require("./helpers/translations.js");
const options = { typing: true };
var languageRoute = (convo) => {  
 	var language = store.getData(payload.sender.id).language || "EN";
    const question = () => {
      convo.sendGenericTemplate([{
        title: translations[language].language,
        subtitle: translations[language].selectLanguage,
        buttons: [
          { type: 'postback', title: translations[language].english, payload: 'English' },
          { type: 'postback', title: translations[language].spanish, payload: 'Spanish' }
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
      var english = arrays.english.find(function(element){return element===text});
      if(english){
      	var data = store.getData(convo.userId);
       	store.setData(convo.userId,Object.assign(data||{},{language:"EN"}));

       	convo.say(	translations[language].languageSet).then(function(){
       		convo.end();
       	});
      }else{
        var spanish = arrays.spanish.find(function(element){return element===text});
        if(spanish){
        	store.setData(convo.userId,Object.assign(data||{},{language:"ES"}));
       		convo.say(translations[language].languageSet).then(function(){
       			convo.end();
       		});
        }else{
          convo.say(translations[language].toExitConv,options);
        }
      }
    };
    convo.ask(question, answer);
};
module.exports = languageRoute;