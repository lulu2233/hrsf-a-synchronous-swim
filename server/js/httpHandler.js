const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messages = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg')
;
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};




module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers);
  var directions = ['left', 'right', 'up', 'down'];
  var index = Math.floor(Math.random()* 4);
  //console.log('test',messages.dequeue());
  if (req.method === 'GET') {
    res.end(messages.dequeue());
  } else if (req.method === 'POST') {
    // res.on('data', (chunk) => {
    //   var body = [];
    //   body.push(chunk);
    // })
    res.end(console.log(req.headers));
  } else {
    res.end();
  }
  next(); // invoke next() at the end of a request to help with testing!
};
