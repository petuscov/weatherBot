"use strict";
require('dotenv').config();
// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'), 
  privateKey = fs.readFileSync('privkey.pem'),
  certificate = fs.readFileSync('fullchain.pem'),
  app = express().use(bodyParser.json()), // creates express http server
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
  //checkCommand = require('helpers/mainHelper');
  mainHelper = require("./helpers/mainHelper"),
  https = require("https");
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
  
  var body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    var response = "";
    var userPsid = "";
    var promesa = Promise.resolve("not handled");
   
    // Iterates over each entry - there may be multiple if batched ???
    body.entry.forEach(function(entry) {//???
  
      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      var webhook_event = entry.messaging[0];
      if(webhook_event.message){
        var message = webhook_event.message.text;
        userPsid= webhook_event.sender.id;
        if(message.charAt(0)==="/"){
          var espacio = message.indexOf(" ");
          var command = espacio!=-1 ? message.slice(1,espacio) : message.slice(1) ;
          var params = espacio!=-1 ? message.slice(espacio) : "";
          promesa = mainHelper.checkCommand(userPsid,command,params);
        }else{
          //console.log("Processing received msg");
          promesa = mainHelper.processMessage(userPsid,command,message);
        }
        
      }else if(webhook_event.postback){
        promesa = mainHelper.handlePostback(userPsid, webhook_event.postback);
      }
      
      promesa.then(function(message){
        var nueva = Promise.resolve();
        nueva = sendResponse(message[0],userPsid).catch(function(err){console.log(err);}); 
        if(message[1]){ //si tras procesar comando/mensaje/postback bot desea enviar 2 mensajes consecutivos.
          nueva = nueva.then(function(){
            console.log("first sending has been done");
            return new Promise(function(resolve,reject){
              setTimeout(resolve,1000);
            });
          }).then(function(){
            return sendResponse(message[1],userPsid).catch(function(err){console.log(err);}); 
          });
        }
      }).catch(function(message){
        console.log("error: " + message);
      });
      
    });
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

//Initial verification
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
  console.log("initial verification");
  // Your verify token. Should be a random string.
  var VERIFY_TOKEN = PAGE_ACCESS_TOKEN;
    
  // Parse the query params
  var mode = req.query['hub.mode'];
  var token = req.query['hub.verify_token'];
  var challenge = req.query['hub.challenge'];
    
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

var port =process.env.PORT || 1337; 
https.createServer({
   key: privateKey,
   cert: certificate
}, app).listen(port, () => console.log('webhook is listening in port: '+ port));


//-------UTILITIES FUNCTIONS-----------//

function sendResponse(message,recipient){
  //console.log("Sending msg");
  var sendApiPath = "/v2.6/me/messages?access_token=" + process.env.PAGE_ACCESS_TOKEN;
  var response = {};
  response.messaging_type = "RESPONSE";
  response.recipient = {}; response.recipient.id = recipient; 
  response.message = {}; response.message.text = message; 
  //response.message = message;
  //console.log(response);
  //response = JSON.stringify(response);
  //console.log(response);
  
  var options = {
    host: "graph.facebook.com",
    path: sendApiPath,
    contentType: 'application/json',
    port: '443',
    method: 'POST',
    key: privateKey,
    cert: certificate,
    body: response
  }
  var promesa = new Promise(function(resolve,reject){
    console.log("sending request");
    var req = https.request(options,function(res){
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        if(res.statusCode === 200){
          console.log("response status OK");
          console.log(body);
          resolve(res);
        }else{
          console.log("statusCode: "+ res.statusCode);
          //console.log(res);
          reject("bad response status");
        }
      });
    });
    req.on("error", function(err){
      console.log(err);
      reject("error in request");
    });
    req.end();
  });
  return promesa;
  
}

