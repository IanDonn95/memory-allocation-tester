// worker.js
let receivedData = [];

self.onmessage = function (e) {
  console.log(e);
  if (e.type === "clean") {
    receivedData = [];
  } else {
    receivedData.push(e.data); // Storing received data
  }
};
