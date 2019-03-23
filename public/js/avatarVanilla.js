// doStuff()

// async function doStuff() {
//   console.log('doing stuff')
//   const photo = await getSomeAsyncData('avatarJSON')
//   if (photo) {
//     console.log(photo)
//   }

// }

// function arrayBufferToBase64(buffer) {
//   var binary = '';
//   var bytes = [].slice.call(new Uint8Array(buffer));
//   bytes.forEach((b) => binary += String.fromCharCode(b));
//   return window.btoa(binary);
// };

// function fetchTheData(someValue) {
//   return new Promise((resolve, reject) => {
//     getData(someValue, (result) => {
//       resolve(result);
//     })
//   });
// }

// async function getSomeAsyncData(value) {
//   const result = await fetchTheData(value);
//   return result;
// }

// function getData(path, callback) {
//   console.log('getting data')

//   fetch(path)
//     .then((res) => res.json())
//     .then((res) => {
//       const base64Flag = 'data:image/jpeg;base64,';
//       const photoBuffer = res.photo[0].img.data.data
//       const base64 = arrayBufferToBase64(photoBuffer)
//       const img = base64Flag + base64
//       callback(img)

//     })
// }

