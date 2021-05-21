let iframeLoaded = false;
window.addEventListener("load", () => {
  const url = "http://localhost:3007/index.html";
  const iframe = document.createElement("iframe");
  iframe.src = url;
  document.body.appendChild(iframe);
  const interval = setInterval(() => {
    if (iframeLoaded) {
      clearInterval(interval);
    } else {
      console.log("Retrying iframe load...");
      iframe.src = url;
    }
  }, 500);
  window.addEventListener("message", () => {
    iframeLoaded = true;
  });
});
