import { readFile } from 'fs';
import { accessSync, constants } from 'fs';
import { spawn } from 'child_process';
import { watchFile } from 'fs';


const num = process.argv[3];
const ruta = process.argv[3];

try {
  accessSync(ruta, constants.R_OK);
  console.log('can read');
} catch (err) {
  console.error('no access');
}

readFile(ruta, (err, data) => {
  if (err) {
    console.log('El fichero que se quiere leer no existe');
  } else {
    console.log('Contenido completo del fichero es el siguiente:');
    console.log(data.toString());
  }
});

if(process.argv.length != 4) {
  console.log("Los argumentos pasados no son sufucientes ");
}
else {
  watchFile(ruta, (curr, prev) => {
    console.log(`File was ${prev.size} bytes before it was modified.`);
    console.log(`Now file is ${curr.size} bytes.`);
  
      const cut = spawn('cut', ['-d', ',', '-f', num, ruta]);
      let Output = '';
      cut.stdout.on('data', (piece) => Output += piece);
      console.log("");
  
      cut.on('close', () => {
      const array = Output.split('\n');
      console.log(array);
    });
  });
  
}



