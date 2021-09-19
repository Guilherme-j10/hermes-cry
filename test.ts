import { Hermes } from "./src";

const crypass = new Hermes();

(async () => {
  try {
    const cry = await crypass.encDataTransfer('ola mundo')
    const rest = await crypass.decDataTransfer(cry);
    console.log(rest);
  } catch (error) {
    console.log(error);
  }
})();
