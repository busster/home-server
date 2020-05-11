var static = require('node-static');

var url = require('url');

var file = new static.Server('./html');
const statusRequestHandler = require('./api/status.js')
// const spaceRequestHnadler = require('./api/space/index.js')

require('http').createServer(function (request, response) {
  const requestUrl = url.parse(request.url, true)
  if (requestUrl.pathname.indexOf('/status') === 0) {
    statusRequestHandler(request, response)
  } else {
    request.addListener('end', function () {
      file.serve(request, response);
    }).resume();
  }
}).listen(8080);
