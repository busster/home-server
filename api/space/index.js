var url = require('url');

const { createCanvas } = require('canvas')

// const spaceFragmentBuilder = require('./spaceFragment.js')

const { Worker } = require('worker_threads')

function runService(width, height) {
  return new Promise((resolve, reject) => {
    const workerData = { width, height }
    const worker = new Worker('./spaceFragment.js', { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
  })
}

async function run(ctx, width, height) {
  const fragment = await runService(width, height)
  console.log('done')
  ctx.putImageData(fragment, x, y)
}

const buildSpace = (request) => {
  return new Promise((resolve, reject) => {
    const query = url.parse(request.url, true).query

    const width = parseInt(query.width) || 200
    const height = parseInt(query.height) || 200

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const chunkSize = 100

    const promises = []

    for (let x = 0; x < width; x+=chunkSize) {
      for (let y = 0; y < height; y+=chunkSize) {

        promises.push(run(ctx, chunkSize, chunkSize).catch(err => console.error(err)))

        // promises.push(new Promise((resolve, reject) => {
        //   spaceFragmentBuilder(chunkSize, chunkSize)
        //     .then(fragment => {
        //       // console.log(`x: ${x}, y: ${y}`)
        //       ctx.putImageData(fragment, x, y)
        //       resolve()
        //     })
        //     .catch((err) => console.log(err))
        // }))
      }
    }

    Promise.all(promises)
      .then((data) => {
        resolve(canvas.toDataURL())
      })
      .catch((err) => console.log(err))
  })
}

module.exports = (request, response) => {
  buildSpace(request).then((data) => {
    response.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'vapor-clock'
    });
    response.write(data)
  }).catch((error) => {
    response.writeHead(500, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'vapor-clock'
    });
    response.write(error)
  }).finally(() => {
    response.end()
  })
}