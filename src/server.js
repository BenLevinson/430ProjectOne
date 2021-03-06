const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

let recentNum = 0; // keep track of which was the most recently clicked image

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => { // handle post
  if (parsedUrl.pathname === '/uploadPhoto') {
    const res = response;
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      jsonHandler.uploadPhoto(request, res, bodyParams);
      recentNum = bodyParams.picNum - 1; // posted image becomes most recently clicked
    });
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  switch (request.method) {
    case 'GET': // get requests
      if (parsedUrl.pathname === '/') {
        htmlHandler.getIndex(request, response);
      } else if (parsedUrl.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
      } else if (parsedUrl.pathname === '/initialGet') {
        jsonHandler.getInitial(request, response);
      } else if (parsedUrl.pathname === '/standardPhoto1') {
        jsonHandler.getPhoto(request, response, 0);
        recentNum = 0;
      } else if (parsedUrl.pathname === '/standardPhoto2') {
        jsonHandler.getPhoto(request, response, 1);
        recentNum = 1;
      } else if (parsedUrl.pathname === '/standardPhoto3') {
        jsonHandler.getPhoto(request, response, 2);
        recentNum = 2;
      } else if (parsedUrl.pathname === '/standardPhoto4') {
        jsonHandler.getPhoto(request, response, 3);
        recentNum = 3;
      } else if (parsedUrl.pathname === '/standardPhoto5') {
        jsonHandler.getPhoto(request, response, 4);
        recentNum = 4;
      } else if (parsedUrl.pathname === '/standardPhoto6') {
        jsonHandler.getPhoto(request, response, 5);
        recentNum = 5;
      } else if (parsedUrl.pathname === '/standardPhoto7') {
        jsonHandler.getPhoto(request, response, 6);
        recentNum = 6;
      } else if (parsedUrl.pathname === '/standardPhoto8') {
        jsonHandler.getPhoto(request, response, 7);
        recentNum = 7;
      } else if (parsedUrl.pathname === '/standardPhoto9') {
        jsonHandler.getPhoto(request, response, 8);
        recentNum = 8;
      } else if (parsedUrl.pathname === '/getRecent') {
        jsonHandler.getRecent(request, response, params, recentNum);
      } else if (parsedUrl.pathname === '/scrapbookPNG.png') {
        htmlHandler.getImage(request, response, 0);
      } else if (parsedUrl.pathname === '/scrapbookOpen.png') {
        htmlHandler.getImage(request, response, 1);
      } else {
        jsonHandler.notFound(request, response);
      }
      break;
    case 'HEAD': // head request
      if (parsedUrl.pathname === '/getPhoto') {
        jsonHandler.getPhotoMeta(request, response);
      } else {
        jsonHandler.notFoundMeta(request, response);
      }
      break;
    case 'POST': // post request
      if (parsedUrl.pathname === '/uploadPhoto') {
        handlePost(request, response, parsedUrl);
      } else {
        jsonHandler.notFound(request, response);
      }
      break;
    default:
      jsonHandler.notFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
