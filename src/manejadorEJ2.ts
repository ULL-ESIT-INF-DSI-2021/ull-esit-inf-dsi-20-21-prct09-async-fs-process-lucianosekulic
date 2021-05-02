import {spawn} from 'child_process';


export class Manejador {

  private fichero: string;
  private fs = require('fs');
 
  constructor(Fichero: string) {
    this.fichero = Fichero;
  }


  /**
   * funcion para imprimir sin el uso de pipe
   * @param tipo 
   */
  public imprimir(tipo: string[]) {

    if (this.fs.existsSync(this.fichero)) {
      const wc = spawn('wc', [this.fichero]);
      let wcOutput = '';
      wc.stdout.on('data', (piece) => wcOutput += piece);

      wc.on('close', () => {
        const wcArray = wcOutput.split(/\s+/);

        for(let i = 0; i < tipo.length; i++) {
          if(tipo[i] == 'lines') {
            console.log(`El archivo tiene ${parseInt(wcArray[1]) + 1} lineas.`);
          }
          else if(tipo[i] == 'words') {
            console.log(`El archivo tiene ${wcArray[2]} palabras.`);
          }
          else if(tipo[i] == 'chars') {
            console.log(`El archivo tiene ${wcArray[3]} letras.`);
          }
          else {
            console.log(`No se reconoce el argumento ${tipo}.`);
          }
        }
      });
    } 
    else {
      console.error(`No se ha podido encontrar el archivo ${this.fichero}`);
    }
  }


  /**
   * funcion para imprimir usando el pipe
   * @param tipo 
   */
  public imprimirConPipe(tipo: string[]) {
    if (this.fs.existsSync(this.fichero)) {
      const wc = spawn('wc', [this.fichero]);
      let wcOutput = '';
      wc.stdout.on('data', (piece) => wcOutput += piece);
  
      wc.on('close', () => {
        const wcArray = wcOutput.split(/\s+/);

        for(let i = 0; i < tipo.length; i++) {
          if(tipo[i] == 'line') {
            const linea = spawn('echo', [(`El archivo tiene ${parseInt(wcArray[1]) + 1} lineas`)]);
            linea.stdout.pipe(process.stdout);
          }
          else if(tipo[i] == 'words') {
            const palabra = spawn('echo', [(`El archivo tiene ${parseInt(wcArray[2])} palabras`)]);
            palabra.stdout.pipe(process.stdout);
          }
          else if(tipo[i] == 'chars') {
            const letra = spawn('echo', [(`El archivo tiene ${parseInt(wcArray[3])} letras`)]);
            letra.stdout.pipe(process.stdout);
          }
        }
      });
    } 
    else {
      console.error(`No se ha podido encontrar el archivo ${this.fichero}`);
    }
  }
}
 