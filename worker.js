// worker.js
let receivedData = [];

onconnect = function (event) {
  const port = event.ports[0];
  port.onmessage = function (e) {
    console.log(e);
    if (e.data.type === "init") {
      console.log("init");
    } else if (e.data.type === "clean") {
      receivedData = [];
      console.log("clean");
    } else {
      console.log("received data");
      receivedData.push(e.data); // Storing received data
    }
  };
};
