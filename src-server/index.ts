import PetShopContract from "./PetShopContract";

const postMessageToFrame = (message: any) => {
  console.log("[server] ->", message);
  document.querySelector("iframe")?.contentWindow?.postMessage(message, "*");
};

window.addEventListener("load", () => {
  window.addEventListener("message", (m) => {
    console.log("[server] <-", m.data);
    // TODO ...
  });
});

const contract = new PetShopContract(
  "http://seed4t.neo.org:20332",
  (contractState) => postMessageToFrame({ contractState })
);
