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
  //console.log('test',messages.dequeue());
  if (req.method === 'GET') {
    if (res.url === '/background.jpg') {
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
          res.writeHead(404, headers);
          res.end();
        } else {
          res.writeHead(200, headers);
          res.write(data, 'binary');
          res.end();
        }
      })
    }
    else {
      res.writeHead(200, headers);
      res.end(messages.dequeue());
    }


  } else if (req.method === 'POST' && req.url === '/background.jpg') {
    // res.on('data', (chunk) => {
    //   var body = [];
    //   body.push(chunk);
    // })
    res.writeHead(201, headers);
    res.end(console.log(req.headers));
  } else {
    res.writeHead(200, headers);
    res.end();
  }
  next();// invoke next() at the end of a request to help with testing!
};
