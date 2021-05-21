import PetShopContract from "./PetShopContract";

const contract = new PetShopContract("http://seed4t.neo.org:20332");

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
