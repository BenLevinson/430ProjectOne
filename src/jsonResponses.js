// initial upload title and urls
const titles = ['Self Portrait', 'Outer Space', 'Patrick Stewart', 'Standard Photo (4)', 'Standard Photo (5)', 'Standard Photo (6)', 'Standard Photo (7)', 'Standard Photo (8)', 'Standard Photo (9)'];
const urls = ['https://i.imgur.com/Mc5FWUK.png', 'https://i.imgur.com/Vg3cMuD.jpg', 'https://i.imgur.com/xkV9diu.jpg', 'https://i.imgur.com/NiubDNH.png', 'https://i.imgur.com/NiubDNH.png', 'https://i.imgur.com/NiubDNH.png', 'https://i.imgur.com/NiubDNH.png', 'https://i.imgur.com/NiubDNH.png', 'https://i.imgur.com/NiubDNH.png'];

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.end();
};

const getInitial = (request, response) => { // initial get case
  const responseJSON = {
    url: urls,
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getPhoto = (request, response, num) => { // get photo after initial get case
  const responseJSON = {
    message: titles[num],
    url: urls[num],
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getPhotoMeta = (request, response) => respondJSONMeta(request, response, 200);

const getRecent = (request, response, params, num) => { // get recent source
  const responseJSON = {
    message1: `Most recent picture title: ${titles[num]}`,
    message2: 'Most recent picture url: ',
    message3: urls[num],
    id: 'Successful Request',
  };

  if (!params.valid || params.valid !== 'true') { // if valid != true, return with 400
    responseJSON.message = 'Error: Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    // 400 bad request error
    return respondJSON(request, response, 400, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
};

const uploadPhoto = (request, response, bodyParams) => { // upload image
  const responseJSON = {
    message: 'Error: Title, index, and url are all required.',
  };
  // make sure all params are filled out and valid
  if (!bodyParams.title || !bodyParams.picNum || !bodyParams.photo) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;
  for (let i = 0; i < titles.length; i++) {
    if (bodyParams.title === titles[i] && bodyParams.picNum - 1 !== i) {
      responseJSON.message = 'Error: An uploaded photo already has that title.';
      responseCode = 400; // don't let user upload image with existing title
      return respondJSON(request, response, responseCode, responseJSON);
    } if (bodyParams.title === titles[i] && bodyParams.picNum - 1 === i) {
      responseCode = 204; // if user tries to update image but keep the same title
    } else {
      titles[bodyParams.title] = {};
    }
  }

  titles[bodyParams.title].title = bodyParams.title; // set title, photo, and picnum
  titles[bodyParams.title].picNum = bodyParams.picNum;
  titles[bodyParams.title].photo = bodyParams.photo;
  titles[bodyParams.picNum - 1] = titles[bodyParams.title].title;

  urls[bodyParams.title] = bodyParams.title; // set title, photo, and picnum
  urls[bodyParams.photo] = bodyParams.photo;
  urls[bodyParams.picNum - 1] = bodyParams.photo;

  if (responseCode === 201) { // return with 201 if created successfully
    responseJSON.message = titles[bodyParams.title].title;
    responseJSON.url = titles[bodyParams.title].photo;
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode); // return meta data if updating
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'Error: The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getInitial,
  getPhoto,
  getPhotoMeta,
  getRecent,
  uploadPhoto,
  notFound,
  notFoundMeta,
};
