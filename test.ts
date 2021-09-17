import { Mephisto } from "./src";
import { keys } from './keys';

const crypass = new Mephisto();

(async () => {
  const cry = await crypass.encDataTransfer(1.1)

  const rest = crypass.decDataTransfer(keys, cry);
  console.log(cry);
})();
