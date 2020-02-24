const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messages = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('image', 'background.jpg')
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
    if (req.url === '/background.jpg') {
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
          res.writeHead(404, headers);
          res.end();
        } else {
          console.log("data.length = " + data.length);
          res.writeHead(200, {
            'Content-Type': 'image/jepg',
            'Content-Length' : data.length
          });
          res.write(data, 'binary');
          res.end();
        }
      })
    } else {
      res.writeHead(200, headers);
      res.end(messages.dequeue());
    }
  }

  if (req.method === 'POST' && req.url === '/background.jpg') {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!');
    var fileData = Buffer.alloc(0);
    req.on('data', (chunk) => {
      fileData = Buffer.concat([fileData, chunk]);
    });
    req.on('end', ()=> {
      console.log("req end");
      var file = multipart.getFile(fileData);
      console.log(file.data);
      fs.writeFile(module.exports.backgroundImageFile, file.data, (err)=> {
        res.writeHead(err ? 400 : 201, headers);
        res.end();
     });
    });
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }
  next();// invoke next() at the end of a request to help with testing!
};
