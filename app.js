document
  .getElementById("allocateTypedArray")
  .addEventListener("click", allocateTypedArray);
document
  .getElementById("allocateSharedWorker")
  .addEventListener("click", allocateSharedWorker);
document
  .getElementById("allocateMainThread")
  .addEventListener("click", allocateMainThread);

let arrays = [];
function allocateTypedArray() {
  let size = (1024 * 1024 * 10) / 8; // 10 MB
  try {
    const r = Math.random();
    while (true) {
      console.log(arrays.length);
      let arrayBuffer = new Float64Array(size);
      for (let i = 0; i < size; i++) {
        arrayBuffer[i] = r;
      }
      arrays.push(arrayBuffer);
      updateTypedMemoryAllocated((arrays.length * size * 8) / (1024 * 1024));
    }
  } catch (e) {
    console.error(e);
    updateStatus(
      `Typed Array allocation failed after ${
        (arrays.length * size * 8) / (1024 * 1024)
      } MB`
    );
  }
}

let worker = new SharedWorker("worker.js");
function allocateSharedWorker() {
  let size = 1024 * 1024 * 100; // 10 MB
  let totalAllocated = 0;
  try {
    while (true) {
      let largeData = new Uint8Array(size);
      worker.port.postMessage(largeData);
      totalAllocated += size;
      updateWorkerMemoryAllocated(totalAllocated / (1024 * 1024));
    }
  } catch (e) {
    console.error(e);
    updateStatus(
      `Shared Worker allocation failed after ${
        totalAllocated / (1024 * 1024)
      } MB`
    );
    worker.port.postMessage({ type: "clean" });
  }
}

let objects = [];

2;
function allocateMainThread() {
  // const chunk = 0.5;
  const chunk = 1;
  const limit = 2900;
  const size = (1024 * 1024 * chunk) / 8;
  const length = limit / chunk;
  Promise.all(
    Array.from({ length }).map(() => {
      return new Promise((r) =>
        setTimeout(() => {
          let largeObject = Array.from({ length: size }).map(Math.random);
          objects.push(largeObject);
          console.log(objects.length);
          updateMainMemoryAllocated((objects.length * size * 8) / 1024 / 1024);
          r();
        }, Math.random() * length * 3)
      );
    })
  ).then((promises) => {
    updateStatus(
      `Main thread allocation stopped after ${
        (objects.length * size * 8) / 1024 / 1024
      } MB`
    );
  });
}

function updateMainMemoryAllocated(amount) {
  document.getElementById(
    "mainMemoryAllocated"
  ).innerText = `Main Heap Memory Allocated: ${amount.toFixed(2)} MB`;
}
function updateTypedMemoryAllocated(amount) {
  document.getElementById(
    "typedMemoryAllocated"
  ).innerText = `Typed Array Memory Allocated: ${amount.toFixed(2)} MB`;
}
function updateWorkerMemoryAllocated(amount) {
  document.getElementById(
    "workerMemoryAllocated"
  ).innerText = `Shared Worker Memory Allocated: ${amount.toFixed(2)} MB`;
}

function updateStatus(message) {
  document.getElementById("status").innerText = message;
}

setInterval(() => {
  document.getElementById("diagnosticLogs").innerText = JSON.stringify({
    totalJSHeapSize: `${(
      performance.memory.totalJSHeapSize /
      1024 /
      1024
    ).toFixed(4)} MB`,
    usedJSHeapSize: `${(
      performance.memory.usedJSHeapSize /
      1024 /
      1024
    ).toFixed(4)} MB`,
    jsHeapSizeLimit: `${(
      performance.memory.jsHeapSizeLimit /
      1024 /
      1024
    ).toFixed(4)} MB`,
  });
}, 500);
