const titles = ['Self Portrait', 'Outer Space', 'Standard Photo (3)', 'Standard Photo (4)', 'Standard Photo (5)', 'Standard Photo (6)', 'Standard Photo (7)', 'Standard Photo (8)', 'Standard Photo (9)'];
const urls = ['https://i.imgur.com/Mc5FWUK.png', 'https://i.imgur.com/Vg3cMuD.jpg', 'https://i.imgur.com/NiubDNH.png', 'https://i.imgur.com/NiubDNH.png', 'https://i.imgur.com/NiubDNH.png', 'https://i.imgur.com/NiubDNH.png', 'https://i.imgur.com/NiubDNH.png', 'https://i.imgur.com/NiubDNH.png', 'https://i.imgur.com/NiubDNH.png'];

const respondJSON = (request, response, status, object) => {
  const headers = {
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

const getInitial = (request, response) => {
  const responseJSON = {
    url: urls,
  }
  return respondJSON(request, response, 200, responseJSON);
};

const getPhoto = (request, response, num) => {
  const responseJSON = {
    message: titles[num],
    url: urls[num],
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getPhotoMeta = (request, response) => {
  return respondJSONMeta(request, response, 200);
};

const uploadPhoto = (request, response, bodyParams) => {
  const responseJSON = {
    message: 'Title, index, and url are both required.',
  };

  if (!bodyParams.title || !bodyParams.picNum || !bodyParams.photo) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;
  if (titles[bodyParams.title] && urls[bodyParams.photo]) {
    responseCode = 204;
  } else {
    titles[bodyParams.title] = {};
  }

  titles[bodyParams.title].title = bodyParams.title;
  titles[bodyParams.title].picNum = bodyParams.picNum;
  titles[bodyParams.title].photo = bodyParams.photo;
  titles[bodyParams.picNum - 1] = titles[bodyParams.title].title;

  urls[bodyParams.title] = bodyParams.title;
  urls[bodyParams.photo] = bodyParams.photo;
  urls[bodyParams.picNum - 1] = bodyParams.photo;

  if (responseCode === 201) {
    responseJSON.message = titles[bodyParams.title].title;
    responseJSON.url = titles[bodyParams.title].photo;
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
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
  uploadPhoto,
  notFound,
  notFoundMeta,
};
