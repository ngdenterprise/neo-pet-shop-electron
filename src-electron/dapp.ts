const postMessageToFrame = (message: any) => {
  console.log("->", message);
  document.querySelector("iframe")?.contentWindow?.postMessage(message, "*");
};

const processMessage = (message: any) => {
  console.log("<-", message);
  // TODO...
};

window.addEventListener("load", () => {
  window.addEventListener("message", (m) => {
    processMessage(m.data);
  });
});
