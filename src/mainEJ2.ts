import * as yargs from 'yargs';
import {Manejador} from "../src/manejadorEJ2";


yargs.command( {
  command: 'informacion',
  describe: 'Devuelve la informacion del archivo',
  builder: {
    file: {
      describe: 'Nombre del fichero',
      demandOption: true,
      type: 'string',
    },
    pipe: {
      describe: 'hacer uso de un pipe o no',
      demandOption: true,
      type: 'string',
    },
    linea: {
      describe: 'Contador de lineas',
      demandOption: false,
      type: 'string',
    },
    palabras: {
      describe: 'Contador de palabras',
      demandOption: false,
      type: 'string',
    },
    letras: {
      describe: 'Contdor de letras',
      demandOption: false,
      type: 'string',
    },
  },




  handler(argv) {
    if ((typeof argv.file === "string") && (typeof argv.pipe === "string")) {

      let tipos: string[] = [];
      if ((typeof argv.linea === "string") && (argv.linea === "yes")) {
        tipos.push('linea');
      }
      if ((typeof argv.palabras === "string") && (argv.palabras === "yes")) {
        tipos.push('palabras');
      }
      if ((typeof argv.letras === "string") && (argv.letras === "yes")) {
        tipos.push('letras');
      }
      if (tipos.length === 0) {
        console.log("introduzca una opcion");
        return;
      }


      const aux = new Manejador(argv.file);
      if(argv.pipe == "yes") {
        aux.imprimirConPipe(tipos);
      }
      else if(argv.pipe == "no") {
        aux.imprimir(tipos);
      }
      else {
        console.log("Debe intEroducir el nombre del fichero");
      }
    }
  } 
});

yargs.argv;
yargs.parse();