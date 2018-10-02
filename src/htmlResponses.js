const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const scrapbookStart = fs.readFileSync(`${__dirname}/../client/scrapbookPNG.png`);
const scrapbookOpen = fs.readFileSync(`${__dirname}/../client/scrapbookOpen.png`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getImage = (request, response, num) => {
  const images = [scrapbookStart, scrapbookOpen];
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(images[num]);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getImage,
};
