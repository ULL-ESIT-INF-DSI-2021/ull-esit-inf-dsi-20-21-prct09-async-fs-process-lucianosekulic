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