const { workerData, parentPort } = require('worker_threads')

console.log('asfd')

const width = workerData && workerData.width
const height = workerData && workerData.height

console.log(width)

// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"

function hexToRgbA(hex){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return {
        r: (c>>16)&255,
        g: (c>>8)&255,
        b: c&255,
        a: 1
      }
  }
  throw new Error('Bad Hex');
}

const randomWeighted = (values) => {
let i, pickedValue,
        randomNr = Math.random(),
        threshold = 0;

for (i = 0; i < values.length; i++) {
    if (values[i].probability === '*') {
        continue;
    }

    threshold += values[i].probability;
    if (threshold > randomNr) {
            pickedValue = values[i].value;
            break;
    }

    if (!pickedValue) {
        //nothing found based on probability value, so pick element marked with wildcard
        pickedValue = values.find((value) => value.probability === '*').value;
    }
}

return pickedValue;
}

const stylesWeighted = [
{
  value: '#0F2749',
  probability: 0.00001
},
{
  value: '#5DC3EF',
  probability: 0.0001
},
{
  value: '#4978BC',
  probability: 0.000001
},
{
  value: '#415A77',
  probability: 0.00001
},
{
  value: '#778DA9',
  probability: 0.00205
},
{
  value: '#16161B',
  probability: 0.0000021
},
{
  value: '#202025',
  probability: 0.0003021
},
{
  value: '#3F3F4A',
  probability: 0.0023025
},
{
  value: '#72747F',
  probability: 0.0000230925
},
{
  value: '#F6F6F7',
  probability: 0.000017
},
{
  value: '#000',
  probability: '*'
}
]

const { createImageData } = require('canvas')

// module.exports = (width, height) => {
//   return new Promise((resolve, reject) => {
//     const imagedata = createImageData(width, height);

//     for (let x = 0; x < width; x++) {
//       for (let y = 0; y < height; y++) {
//         const pixelindex = (y * width + x) * 4;
//         const { r, g, b, a } = hexToRgbA(randomWeighted(stylesWeighted))
//         imagedata.data[pixelindex] = r;
//         imagedata.data[pixelindex + 1] = g;
//         imagedata.data[pixelindex + 2] = b;
//         imagedata.data[pixelindex + 3] = 255;
//       }
//     }
//     resolve(imagedata)
//   })
// }

const imagedata = createImageData(width, height);

for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    const pixelindex = (y * width + x) * 4;
    const { r, g, b, a } = hexToRgbA(randomWeighted(stylesWeighted))
    imagedata.data[pixelindex] = r;
    imagedata.data[pixelindex + 1] = g;
    imagedata.data[pixelindex + 2] = b;
    imagedata.data[pixelindex + 3] = 255;
  }
}


parentPort.postMessage({ imagedata })