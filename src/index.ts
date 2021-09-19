import { CompleteASCII, HashMask } from "./Presets";
import path from 'path';
import fs from 'fs';

interface DataMask {
  keyNumber: String,
  size: number,
  dataSet: Array<String>,
  data: Array<String>
}

export class Hermes {

  private nameFile = 'dataset_hermes.txt';

  CreateFile(Callback: Function){
    fs.access(path.resolve(__dirname, '..', this.nameFile), (err) => {
      if(err){
        let keysOut = []; 
        for(let i = 0; i < 100; i++){

          let keys: DataMask = {
            keyNumber: `Key_`+(() => {
              if(i < 10){
                return `0${i}`;
              }

              return i;
            })(),
            size: 0,
            dataSet: [],
            data: []
          }

          let randomSize = Math.floor(Math.random() * (8 - 4) + 4);
          for(let x = 0; x < CompleteASCII.length; ++x){
            let string = '';
            for(let y = 0; y < randomSize; y++){
              string += HashMask[Math.floor(Math.random() * HashMask.length)];  
            }
            keys.dataSet.push(string);
            keys.size = randomSize;
            keys.data.push(CompleteASCII[x]);
          }

          keysOut.push(keys);
        }

        fs.writeFileSync(
          path.resolve(__dirname, '..', this.nameFile),
          JSON.stringify(keysOut)
        );
        Callback();
      }

      Callback();
    })
  }

  encDataTransfer(data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.CreateFile(() => {
        try {
          const dataKeys = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', this.nameFile), 'utf8'))[`${Math.floor(Math.random() * 99)}`];
          const structure = JSON.stringify(data).split('');
          let StringTransfer = dataKeys.keyNumber.split('_')[1];
          for(let y in structure){
            for(let x in dataKeys.data){
              if(dataKeys.data[x] === structure[y]){
                StringTransfer += dataKeys.dataSet[x];
              }
            }
          }
          StringTransfer += dataKeys.size;
    
          resolve(Buffer.from(StringTransfer.split('').reverse().join('')).toString('base64'));
        } catch {
          reject('Não foi possivel encriptar os dados.');
        }
      });
    })
  }

  decDataTransfer(data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.access(path.resolve(__dirname, '..', this.nameFile), (err) => {
        if(err){
          reject('Arquivo de chaves ainda não existe');
          return;
        } 

        const MephistSoon = Buffer.from(data, 'base64').toString('utf8').split('').reverse().join('');
        const arrayString = MephistSoon.split('');

        const key = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', this.nameFile), 'utf8'))[parseInt(`${MephistSoon.split('')[0]}${MephistSoon.split('')[1]}`)];
        arrayString.shift();
        arrayString.shift();

        const size = parseInt(MephistSoon.split('')[MephistSoon.split('').length - 1]);
        arrayString.pop();

        let brokeZ = [];
        let counter = 0;
        while(counter < arrayString.length){

          let z = '';
          for(let i = counter; i < (counter + size); i++){
            z += arrayString[i];
          }

          brokeZ.push(z);
          counter += size;

        }

        let dec = '';
        for(let y in brokeZ){
          for(let x in key.dataSet){
            if(key.dataSet[x] == brokeZ[y]){
              dec += key.data[x];
            }
          }
        }

        resolve(JSON.parse(dec));
      });
    })
  }
}
