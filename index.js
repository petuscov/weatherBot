"use strict";

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()), // creates express http server
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
  //checkCommand = require('helpers/mainHelper');
  mainHelper = require("./helpers/mainHelper"),
  https = require("https");
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
  
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    var response = "";
    var userId = "";
    var promesa = Promise.resolve("not handled");
   
    // Iterates over each entry - there may be multiple if batched ???
    body.entry.forEach(function(entry) {//???
      if(!entry.messaging){console.log("received something without messaging object.");res.sendStatus(200);return;}
      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      //console.log(webhook_event);
      let message = webhook_event.message.text;
      userId= webhook_event.sender.id;
      if(message.charAt(0)==="/"){
        var espacio = message.indexOf(" ");
        var command = espacio!=-1 ? message.slice(1,espacio) : message.slice(1) ;
        var params = espacio!=-1 ? message.slice(espacio) : "";
        promesa = mainHelper.checkCommand(command,params);
      }
    });
    
    promesa.then(function(message){
      
      sendResponse(message,userId); 
      
     
      //console.log(message);
      // Returns a '200 OK' response to all requests
      //res.status(200).send(message);
    }).catch(function(message){
      
      
      console.log("error: " + message);
      // Returns a '200 OK' response to all requests
      //res.status(200).send(message);
    });
   
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    console.log("nah");
    res.sendStatus(404);
  }

});

//Initial verification
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
  console.log("initial verification");
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = PAGE_ACCESS_TOKEN;
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    console.log("TOKEN: " + token);
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

//for curious browsers.
app.get('/', (req, res) => {
   res.status(200).send("webhook exposed");
});

// Sets server port and logs message on success
var port = process.env.PORT || 1337;
app.listen(port, () => console.log('webhook is listening in port: '+ port));


//-------UTILITIES FUNCTIONS-----------//

function sendResponse(message,recipient){
  var sendApiPath = "v2.6/me/messages?access_token=" + process.env.PAGE_ACCESS_TOKEN;
  var response = {};
  response.messaging_type = "RESPONSE";
  response.recipient = {}; response.recipient.id = recipient; 
  response.message = {}; response.message.text = message; 
  //console.log(response);
  //response = JSON.stringify(response);
  //console.log(response);
  
  var options = {
    host: "graph.facebook.com",
    path: sendApiPath,
    contentType: 'application/json',
    port: '443',
    method: 'POST',
    body: response
  }
  https.request(options,(res)=> {console.log("sended");});
}