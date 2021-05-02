import * as yargs from 'yargs';
import {Comandos} from '../src/comandosEJ4';
const comandos = new Comandos;


/**
 * comando comprobar
 */
yargs.command( {
  command: 'comprobar',
  describe: 'comprueba la ruta',
  builder: {
    route: {
      describe: 'ruta a comprobar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === "string") {
      let result: string | boolean = comandos.comprobar(argv.route);
      //if (typeof result === false) {
        //console.log(`Error en la ruta`);
      //} 
      //else {
        console.log(`La ruta es un ${result}.`);
      //}
    }
  },
});


/**
 * crea nuevo directorio
 */
yargs.command( {
  command: 'mkdir',
  describe: 'crea un directorio',
  builder: {
    route: {
      describe: 'ruta',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === "string") {
      if (comandos.mkdir(argv.route)) {
        console.log("El directorio se ha creado");
      } 
      else {
        console.log("No se ha podido crear el directorio");
      }
    }
  },
});


/**
 * comando para ls
 */
yargs.command( {
  command: 'ls',
  describe: 'lista el directorio',
  builder: {
    route: {
      describe: 'ruta.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === "string") {
      let aux = comandos.ls(argv.route)
      console.log(aux);
    }
  },
});

/**
 * comando para uso del cat
 */
yargs.command( {
  command: 'cat',
  describe: 'muestra contenido de un fichero',
  builder: {
    route: {
      describe: 'ruta',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === "string") {
      let aux = comandos.cat(argv.route);
      console.log(aux);
    }
  },
});


/**
 *comando para borrar un dir
 */
yargs.command( {
  command: 'borrar',
  describe: 'borra el archivo o directorio',
  builder: {
    route: {
      describe: 'ruta',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === "string") {
        if (comandos.borrar(argv.route)) {
          console.log("Borrado");
        } 
        else {
          console.log("No se ha podido borrar");
        }
      }
  },
});


/**
 * Comando para mover
 */
yargs.command( {
  command: 'mover',
  describe: 'mueve de un lugar a otro',
  builder: {
    source: {
      describe: 'ruta',
      demandOption: true,
      type: 'string',
    },
    destiny: {
      describe: 'Destino',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.source === "string") && (typeof argv.destiny === "string")) {
      if (comandos.mover(argv.source, argv.destiny)) {
        console.log("Se ha movido");
      } else {
        console.log("No se ha podido mover");
      }
    }
  },
});


/**
 * Comando para copiar
 */
yargs.command( {
  command: 'copiar',
  describe: 'copia un elemento',
  builder: {
    source: {
      describe: 'ruta',
      demandOption: true,
      type: 'string',
    },
    destiny: {
      describe: 'destino',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.source === "string") && (typeof argv.destiny === "string")) {
      if (comandos.copiar(argv.source, argv.destiny)) {
        console.log("DSe ha copiado exitosamente");
      }
      else {
        console.log("No se ha podido copiar");
      }
    }
  },
});


yargs.parse();