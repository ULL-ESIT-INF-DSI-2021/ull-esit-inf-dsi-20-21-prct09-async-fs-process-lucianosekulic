# Practica 9 DSI


## Ejercicio 1

En este ejercicio se pide hacer una traza mostrando el contenido de la pila de llamadas, el registro de eventos de la API, la cola de manejadores de Node.js y lo que se muestra por la consola. Haciendo uso del siguiente recurso dado por el profesorado.

[Recurso](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)

``` 
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```

Una vez analizado el código, se procede a realizar la traza:

* Inicialmente: En un principio al iniciarse, las colas están vacías.
* 1º

* * Procede a entrar en **pila** la función anónima main

* 2º

* * En este paso, se proceden a cargar las diversas librerías y argumentos, entrando access en la **API**

* 3º

* * Acaba la función anónima main, access ya no está en la **API** y procede a entrar el callback en la **cola**

* 4º

* * Se añade a la pila el callback para que se pueda ejecutar correctamente la función y poder devolver un valor

* * Tenemos ahora en la pila -> callback y console.log(starting to wacth file ${filename})

* 5º

* * Se retorna en el output el valor de la función
* * Sigue estando en la pila el callback

* 6º 

* * Procede a intriducirse la funcion watch en la pila

* 7º

* * Después de que se ejecute wacth, procede a llamar a watch.on y se introduce en la **API**

* 8º

* * Se procede a ejecutar la siguiente función, en este caso, el console.log(File ${filename} is no longer watched), entrando en la pila

* 9º

* * Se ejecuta y devuelve el valor ( File ${filename} is no longer watched ) esperado en el output

* 10º

* * Watcher.on ahora pasa a ser callback y entra en la cola de ejecución

* 11º

* * Como la pila ahora mismo está vacía, el callback de la siguiente función entra en la pila y procede a ejecutarse

* 12º 

* * La función console.log(File ${filename} has been modified somehow), procede a ejecutarse entrando en la pila

* 13º

* * Se devuelve un valor por el output (File ${filename} has been modified somehow)


## Ejercicio 2

Se propone realizar una aplicación donde se proporcione el número de líneas, palabras o caracteres que contiene un fichero de texto

### MainEJ2.ts
``` 
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
        console.log("Debe introducir el nombre del fichero");
      }
    }
  } 
});

yargs.argv;
yargs.parse();

```


En este archivo, usando yargs, tenemos el comando necesario llamados informacion, que devuelve toda la informacipn con respecto al archivo. Donde file es el nombre del fichero, pipe es si se usa el pipe o no, la linea es el contador de lineas del archivo, palabras es el contador de palabras y letras es el contador de letras. Luego con la función handler, miramos si tanto file como pipe, linea, palabra y letras son de tipo string para poder hacer un push al string llamado tipo. Despues creamos un objeto Manejador y miramos si imprimimos con el uso de pipe o no.

### manejadorEJ2.ts

```

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

```
Creamos una clase llamada manejador, donde creamos de manera privada un fichero y un fs para luego trabajar con ellos con más comodidad. Al constructor le pasamos una variable fichero de tipo string y dentro lo declaramos.

La funcion imprimir, se unsa para imprimir lo requerido en el guión sin el uso de pipes. Dentro de esta función miramos si existe el fichero, si es asi realizamos una cuenta mediante wc e imprimimos por pantalla el numero de letras, lineas y palabras, el caso contrario nos devolverá un aviso de que no se ha podido encontrar el archivo.

La función imprimirConPipe, se usa para imprimir lo requerido en el guión mediante el uso de pipes. Dentro de la función, hacemos exactamente lo mismo que la funcion imprimir, solo que con la diferencia de que usamos la funcion spawn guardandola en una variable para luego "imprimirla" haciendo variable.stdout.pipe(process.stdout).

## Ejercicio4

Nos pide el guión desarrolar una aplicacion wrapper de distintos comandos empleados en el manejo de ficheros de linux.

### wrapper.ts

``` 
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

```
En este archivo, creamos los siguientes comandos que nos pide el guión mediante yargs: 
* comprobar: usado para comprobar la ruta del fichero
* mkdir: usado para crear un nuevo directorio
* ls: usado para listar un drectorio en concreto
* cat: usado para mostar el contenido de un fichero
* borrar: usado para borrar un archivo o directorio 
* mover: usado para mover un elemento de un sitio a otro
* copiar: usado para copiar un elemento de un sitio a otro


### comandosEJ4.ts

``` 
import {spawn} from 'child_process';


/**
 * clase comando, donde implementamos diversos comandos usados en linux
 */
export class Comandos {
  private fs = require('fs');


 /**
  * funcion publica para comprobar si es una ruta o dir
  * @param ruta 
  * @returns 
  */
  public comprobar(ruta: string): string | boolean {
      let aux = this.fs.existsSync(ruta);
    if (aux) {
      if (this.fs.lstatSync(ruta).isDirectory()) {
        return "directory";
      }
       else {
        return "file";
      }
    } 
    else {
      return false;
    }
  }

  /**
   * funcion para crear un directorio
   * @param ruta
   * @returns 
   */
  public mkdir(ruta: string) {
      let aux = this.fs.existsSync(ruta);
    if (aux) {
      return false;
    } 
    else {
      this.fs.mkdirSync(ruta);
      return true;
    }
  }


  /**
   * funcion para listar un directorio
   * @param ruta 
   * @returns 
   */
  public ls(ruta: string) {
    let aux = "";
    if (this.comprobar(ruta) == "directory") {
        const ls = spawn('ls', [ruta]);
        ls.stdout.on('data', (piece) => aux += piece);
        ls.stdout.on('close', () => {
        return aux;
        });
    }
    else if(this.comprobar(ruta) == "file") {
        aux = "Imposible hacer un ls en un fichero";
    }
    else {
        aux = "Error 404";
    }
    
    return aux;
  }


 /**
  * funcion para cat, mostramos el contenido del archivo
  * @param ruta 
  * @returns 
  */
  public cat(ruta: string) {
    let aux: string = "";

    if (this.comprobar(ruta) == "file") {
        const cat = spawn('cat', [ruta]);
        cat.stdout.on('data', (piece) => aux += piece);
        cat.stdout.on('close', () => {
        return aux;
        });
    }
    else if(this.comprobar(ruta) == "directory") {
        aux = "Imposible hacer cat en un fichero";
    }
    else {
        aux = "Error 404";
    }
    return aux;
  }


  /**
   * funcion para borrar un archivo o directorio
   * @param ruta 
   * @returns 
   */
  public borrar(ruta: string) {

    if (this.comprobar(ruta) == "file") {
        this.fs.rmSync(ruta);
        return true;
    }
    else if(this.comprobar(ruta) == "directory") {
        this.fs.rmdirSync(ruta);
        return true;
    }
    else {
        return false;
    }
  }

  /**
   * funcion para mover un elemento
   * @param source 
   * @param destiny 
   * @returns 
   */
  public mover(source: string, destiny: string) {
    if (this.fs.existsSync(source)) {
        const mv = spawn('mv', [source, destiny]);
        mv.on('close', () => {
        return true;
      });
      return true;
    } 
    else {
      return false;
    }
  }

  /**
   * funcion para copiar un elemento
   * @param source 
   * @param destiny 
   * @returns 
   */
  public copiar(source: string, destiny: string) {
    if (this.fs.existsSync(source)) {
      const cp = spawn('cp', [source, destiny]);
      cp.on('close', () => {
        return true;
      });
      return true;
    } 
    else {
      return false;
    }
  }
}

```
Creamos una clase llamda comando para implementar los diversos comandos, dichos anteriormente, usados en linux. En primer lugar creamos un private llamado fs para trabajar más facilmente. En la funcion comprobar, miramos si es una ruta o un directorio mediante las funciones lstatsync, existsync e isdirectory.

En la funcion mkdir, para crear un directorio, miramos si existe la ruta, si es asi llamamos a la funcion mkdirsync para crearlo. En la funcion ls, primero comprobamos si la ruta es un directorio, en el caso que no sea lanzamos diversos errores.

En la funcion cat, comprobamos con un if si la ruta dada es un archivo, si es asi mediante el uso de un spawn, "imprimimos" el contenido, en caso contrario lanzamos diversos errores. En la funcion borrar, comprobamos si la ruta es un fichero o un directorio, en caso contrario retornamos false y no podremos borrar nada.
* En caso de que la ruta sea un fichero, llamamos a la funcion rmsync para borrar
* en caso de que la ruta sea un directorio, llamamos a la funcion rmdirsync para borrar

En la funcion mover, comprobamos si existe la fuente, en el caso de que exista, creamos una variable llamada mv con la funcion spawn, pasandole la fuente y el destino y nos devuelve true, sino devuelve false.

En la funcion copiar, hacemos lo mismo que en mover, pero llamando cp a la variable que igualamos a spawn.






