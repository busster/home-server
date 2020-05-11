const https = require('https');

const getStatus = () => {
  return new Promise((resolve, reject) => {
    https.get('https://api.plaza.one/status', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data)
      });

    }).on("error", (err) => {
      reject(err.message)
    })
  })
}

module.exports = (request, response) => {
  getStatus().then((data) => {
    console.log(data)
    response.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'vapor-clock'
    });
    response.write(data)
  }).catch((error) => {
    console.log(error)
    response.writeHead(500, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'vapor-clock'
    });
    response.write(error)
  }).finally(() => {
    response.end()
  })
}
