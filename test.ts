import { Hermes } from "./src";
import { keys } from './dataset_hermes';

const crypass = new Hermes();

(async () => {
  const cry = await crypass.encDataTransfer(1.1)

  const rest = crypass.decDataTransfer(keys, cry);
  console.log(rest);
})();
