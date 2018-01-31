"use strict";

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()), // creates express http server
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
  //checkCommand = require('helpers/mainHelper');
  mainHelper = require("./helpers/mainHelper");
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
  
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    var response = "";
    var promesa = Promise.resolve();
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      let message = webhook_event.message;
      
      if(message.charAt(0)==="/"){
        var espacio = message.indexOf(" ");
        var command = espacio!=-1 ? message.slice(1,espacio) : message.slice(1) ;
        var params = espacio!=-1 ? message.slice(espacio) : "";
        promesa = mainHelper.checkCommand(command,params);
      }
    });
    
    promesa.then(function(message){
       // Returns a '200 OK' response to all requests
      console.log(message);
      res.status(200).send(message);
    }).catch(function(message){
      // Returns a '200 OK' response to all requests
      res.status(200).send(message);
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

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = PAGE_ACCESS_TOKEN;//"cadenamia";
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
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
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));