import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getFirestore, setDoc } from 'firebase/firestore';
import { app } from 'src/app/app.component';

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const Encuestas = collection(db, "Encuestas");

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent 
{
  juegoIniciado = false;

  palabraRandom = "A H O R C A D O";
  palabraRandomReal = "";

  palabraRandomRealProgress = "";
  palabraShowed = new Array();

  letrasProbadas = new Array();
  stringLetrasProbadas = "¡Acá se muestran tus letras probadas!";
  vidas = 6;
  mensajeTemporal = "Mensaje temporal";

  flagEstaLogeado = false;

  usuario:any;
  usuarioID:any;

  constructor() 
  {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => 
    {
      if (user) 
      {
        const uid = user.uid;

        this.usuario = user.email;
        this.usuarioID = uid;

        console.log(this.usuario);
        console.log(this.usuarioID);

        //Si el usuario esta logeado
        let labelError = document.getElementById("error-login-message");
        labelError?.setAttribute("hidden","true");

        let btnSend = document.getElementById("send-button");
        btnSend?.removeAttribute("hidden");

        let txtBoxMessage = document.getElementById("chat-input");
        txtBoxMessage?.removeAttribute("hidden");

        let btnComenzar = document.getElementById("btnComenzar");
        btnComenzar?.removeAttribute("hidden");

        this.flagEstaLogeado = true;
      } 
      else 
      {
        //Si el usuario no esta logeado
        let labelError = document.getElementById("error-login-message");
        labelError?.removeAttribute("hidden");

        let btnSend = document.getElementById("send-button");
        btnSend?.setAttribute("hidden","true");

        let txtBoxMessage = document.getElementById("chat-input");
        txtBoxMessage?.setAttribute("hidden","true");  
      }
    });

  }

  palabrasAhorcado = [
    "PERRO","COCINA","AUTO","FE","DENTISTA",
    "OTORRINO","GATO","LUNA","SOL","TECLADO",
    "CAMIONETA","FRASCO","VIDRIO","SONRISA","RAMPA",
    "SOGA","MARIHUANA","AGUA","GASEOSA","HIELO",
    "CHIP","MASCOTA","ALFOMBRA","VIDEO","TABLETA",
    "MESA","LAMPARA","INTERRUPTOR","PELO","OJOS",
    "NARIZ","CUBO","PELOTA","CELULAR","ENCHUFE",
    "PAJARO","PEZ","PILETA","GUITARRA","BAJO",
    "BATERIA","MICROFONO","MADERA","METAL","ESTANTE",
    "CAJA","MOCHILA","CARTUCHERA","REGLA","LAPIZ",
    "GOMA","SACAPUNTAS","TELGOPOR","PLANETA","MONTAÑA",
    "OIDO","CONTROL","LUZ","NUMERO","CABALLO",
    "HORMIGA","CARACOL","ELECTRICIDAD","FOTO","AMOR",
    "PLANTACION","QUESO","HARINA","POZO","TITULO",
    "INVERSION","NOMBRE","PALABRA","COLECTIVO","CAMION",
    "ZAPATILLA","MEDIAS","PANTALON","CORBATA","CINTURON",
    "COLLAR","JOYA","GORRO","SOMBRERO","BUFANDA",
    "CARROZA","CAMPERA","GOTA","BOLSA","ELECTRICISTA",
    "INGENIERIA","TECNICATURA","CALENDARIO","FECHA","DIA",
    "MILENIO","SIGLO","DECADA","AÑO","MES",
  ];

  comenzarJuego()
  {

    if (this.flagEstaLogeado == true)
    {
      this.vidas = 6;
      this.pickearPalabraRandom();
      this.mostrarFotoAhorcado(6);
      this.juegoIniciado = true;
      this.limpiarLetrasProbadas();
      this.actualizarLetrasProbadas();
    }
    
  }

  letraClickeada(letraClickeada:string)
  {
    if (this.fueClickeadaAnteriormente(letraClickeada) == false && this.juegoIniciado == true)
    {
      this.letrasProbadas.push(letraClickeada);
      this.actualizarLetrasProbadas();
      let hayCoincidencia = this.verificarCoincidenciaLetra(letraClickeada);

      //Si coincide, Mostrar la letra revelada. Si no, Restar una vida, actualizar foto, y si perdió avisar.
      if (hayCoincidencia == true)
      {
        this.mostrarMensajeTemporal("Muy bien!");

        //Mostrar letra coincidente.
        this.mostrarLetraCoincidente(letraClickeada);
        
        //Verificar si gano.
        if (this.verificarSiGano() == true)
        {
          this.juegoIniciado = false;
          this.mostrarMensajeTemporal("¡Ganaste, muy bien!");

          this.guardarPuntuacion();
        }
      }
      else if (this.vidas > -1)
      {
        this.vidas = this.vidas - 1;

        if (this.vidas >= -1)
        {
          this.actualizarFotoPorVidasActuales();  
        }

        if (this.vidas < 0)
        {
          this.juegoIniciado = false;
          this.mostrarMensajeTemporal("¡Perdiste!");
          this.revelarPalabraRandom();

          this.guardarPuntuacion();
        }
      }
    }
    else
    {
      if (this.fueClickeadaAnteriormente(letraClickeada) == true)
      {
        this.mostrarMensajeTemporal("¡La letra ya fue presionada!");
      }
      else if (this.juegoIniciado == false)
      {
        this.mostrarMensajeTemporal("¡El juego no está iniciado!");
      } 
    }
  }

  // Metodos auxiliares para analisis de datos - extra
  private mostrarLetraCoincidente(letraClickeada: string) 
  {
    if (this.palabraRandomReal.includes(letraClickeada) == true) 
    {
        let palabraRandomRealProgressiveCopy = this.palabraRandomRealProgress;

        while(palabraRandomRealProgressiveCopy.includes(letraClickeada) == true)
        {
          palabraRandomRealProgressiveCopy = palabraRandomRealProgressiveCopy.replace(letraClickeada,".");
        }

        this.palabraRandomRealProgress = palabraRandomRealProgressiveCopy;
        console.log(this.palabraRandomRealProgress);

        let indicesCaracteresCoincidentes = new Array();

        for (let i = 0; i < this.palabraRandomReal.length; i++) 
        {
          if (this.palabraRandomReal[i] == letraClickeada)
          {
            indicesCaracteresCoincidentes.push(i);
          }  
        }

        console.log("INDICES DE CARACTERES COINCIDENTES:");
        console.log(indicesCaracteresCoincidentes);

        this.palabraRandomRealProgress = this.palabraRandomRealProgress.replace(".",letraClickeada);
        console.log(this.palabraRandomRealProgress);

        indicesCaracteresCoincidentes.forEach( (element, index) =>
        {
            this.palabraShowed[element] = letraClickeada;
        });
            
        console.log(this.palabraShowed);
        this.actualizarRevelacionPalabraMostrada();
    }
  }

  private actualizarRevelacionPalabraMostrada()
  {
    let stringPalabraShowed  = this.palabraShowed.toString();

    do 
    {
      stringPalabraShowed = stringPalabraShowed.replace(',',' ');

    }while (stringPalabraShowed.includes(",") == true)

      this.palabraRandom = stringPalabraShowed;
  }

  private verificarSiGano()
  {
      if (this.palabraRandom.includes("_") == true)
      {
        return false
      }
      else
      {
        return true;
      }
  }

  private fueClickeadaAnteriormente(letraClickeada:string)
  {
      let fueClickeada;

      if (this.letrasProbadas.includes(letraClickeada) == true)
      {
        fueClickeada = true;
      }
      else
      {
        fueClickeada = false;
      }

      return fueClickeada;
  }

  private actualizarLetrasProbadas()
  {
    this.stringLetrasProbadas = this.letrasProbadas.toString();
  }

  private verificarCoincidenciaLetra(letraClickeada:string)
  {
      console.log(this.palabraRandomReal);
      if (this.palabraRandomReal.includes(letraClickeada) == true)
      {
        return true;
      }

      return false;
  }

  private mostrarMensajeTemporal(mensajeRecibido:string)
  {
    let mensajeTemporalElem = document.getElementById("container-mensaje-temporal");
    mensajeTemporalElem?.removeAttribute("hidden");
    this.mensajeTemporal = mensajeRecibido;

    setTimeout( () => 
    {
      this.mensajeTemporal = "";
      mensajeTemporalElem?.setAttribute("hidden","true");
    }, 3500)
  }

  private revelarPalabraRandom()
  {
    //Tengo que mostrar con los espacios y bien
    
    for (let j = 0; j < this.palabraRandomReal.length; j++) 
    {
      this.palabraShowed[j] = this.palabraRandomReal[j];
    }

    this.actualizarRevelacionPalabraMostrada();
  }

  private actualizarFotoPorVidasActuales()
  {
      console.log("VIDAS: " + this.vidas);
      switch (this.vidas) 
      {
        case -1:
        {
          this.mostrarFotoAhorcado(-1);
          break;
        }
        case 0:
        {
          this.mostrarFotoAhorcado(0);
          break;
        }
        case 1:
        {
          this.mostrarFotoAhorcado(1);
          break;
        }
        case 2:
        {
          this.mostrarFotoAhorcado(2);
          break;
        }
        case 3:
        {
          this.mostrarFotoAhorcado(3);
          break;
        }
        case 4:
        {
          this.mostrarFotoAhorcado(4);
          break;
        }
        case 5:
        {
          this.mostrarFotoAhorcado(5);
          break;
        }
        case 6:
        {
          this.mostrarFotoAhorcado(6);
          break;
        }
      }
  }

  // Metodos auxiliares para comenzar juegos - extra

  private mostrarFotoAhorcado(cantVidasFoto:number)
  {
    let foto0Vidas = document.getElementById("img-0vidas");
    let foto1Vidas = document.getElementById("img-1vidas");
    let foto2Vidas = document.getElementById("img-2vidas");
    let foto3Vidas = document.getElementById("img-3vidas");
    let foto4Vidas = document.getElementById("img-4vidas");
    let foto5Vidas = document.getElementById("img-5vidas");
    let foto6Vidas = document.getElementById("img-6vidas");
    let fotoloseGame = document.getElementById("img-lose-game");

    switch (cantVidasFoto)
    {
      case -1:
      {
        fotoloseGame?.removeAttribute("hidden");

        foto0Vidas?.setAttribute("hidden","true");
        foto1Vidas?.setAttribute("hidden","true");
        foto2Vidas?.setAttribute("hidden","true");
        foto3Vidas?.setAttribute("hidden","true");
        foto4Vidas?.setAttribute("hidden","true");
        foto5Vidas?.setAttribute("hidden","true");
        foto6Vidas?.setAttribute("hidden","true");
        break;
      }
      case 0:
      {
        foto0Vidas?.removeAttribute("hidden");

        foto1Vidas?.setAttribute("hidden","true");
        foto2Vidas?.setAttribute("hidden","true");
        foto3Vidas?.setAttribute("hidden","true");
        foto4Vidas?.setAttribute("hidden","true");
        foto5Vidas?.setAttribute("hidden","true");
        foto6Vidas?.setAttribute("hidden","true");
        fotoloseGame?.setAttribute("hidden","true");
        break;
      }
      case 1:
      {
        foto1Vidas?.removeAttribute("hidden");

        foto0Vidas?.setAttribute("hidden","true");
        foto2Vidas?.setAttribute("hidden","true");
        foto3Vidas?.setAttribute("hidden","true");
        foto4Vidas?.setAttribute("hidden","true");
        foto5Vidas?.setAttribute("hidden","true");
        foto6Vidas?.setAttribute("hidden","true");
        fotoloseGame?.setAttribute("hidden","true");
        break;
      }
      case 2:
      {
        foto2Vidas?.removeAttribute("hidden");

        foto0Vidas?.setAttribute("hidden","true");
        foto1Vidas?.setAttribute("hidden","true");
        foto3Vidas?.setAttribute("hidden","true");
        foto4Vidas?.setAttribute("hidden","true");
        foto5Vidas?.setAttribute("hidden","true");
        foto6Vidas?.setAttribute("hidden","true");
        fotoloseGame?.setAttribute("hidden","true");
        break;
      }
      case 3:
      {
        foto3Vidas?.removeAttribute("hidden");

        foto0Vidas?.setAttribute("hidden","true");
        foto1Vidas?.setAttribute("hidden","true");
        foto2Vidas?.setAttribute("hidden","true");
        foto4Vidas?.setAttribute("hidden","true");
        foto5Vidas?.setAttribute("hidden","true");
        foto6Vidas?.setAttribute("hidden","true");
        fotoloseGame?.setAttribute("hidden","true");
        break;
      }
      case 4:
      {
        foto4Vidas?.removeAttribute("hidden");

        foto0Vidas?.setAttribute("hidden","true");
        foto1Vidas?.setAttribute("hidden","true");
        foto2Vidas?.setAttribute("hidden","true");
        foto3Vidas?.setAttribute("hidden","true");
        foto5Vidas?.setAttribute("hidden","true");
        foto6Vidas?.setAttribute("hidden","true");
        fotoloseGame?.setAttribute("hidden","true");
        break;
      }
      case 5:
      {
        foto5Vidas?.removeAttribute("hidden");

        foto0Vidas?.setAttribute("hidden","true");
        foto1Vidas?.setAttribute("hidden","true");
        foto2Vidas?.setAttribute("hidden","true");
        foto3Vidas?.setAttribute("hidden","true");
        foto4Vidas?.setAttribute("hidden","true");
        foto6Vidas?.setAttribute("hidden","true");
        fotoloseGame?.setAttribute("hidden","true");
        break;
      }
      case 6:
      {
        foto6Vidas?.removeAttribute("hidden");

        foto0Vidas?.setAttribute("hidden","true");
        foto1Vidas?.setAttribute("hidden","true");
        foto2Vidas?.setAttribute("hidden","true");
        foto3Vidas?.setAttribute("hidden","true");
        foto4Vidas?.setAttribute("hidden","true");
        foto5Vidas?.setAttribute("hidden","true");
        fotoloseGame?.setAttribute("hidden","true");
        break;
      }
    }
  }

  private pickearPalabraRandom()
  {
    // Traigo un numero del 0 al 99
    let numeroRandom = Math.floor(Math.random() * (98 - 0 + 1)) + 1;
    let palabraRandom = this.palabrasAhorcado[numeroRandom];
    this.palabraRandomReal = palabraRandom;
      
    this.mostrarPalabraEnMesa(palabraRandom);
  }

  private mostrarPalabraEnMesa(palabraRandomRecibida:string)
  {
    let palabraIncognita = this.convertirPalabraIncognita(palabraRandomRecibida);
    this.palabraRandom = palabraIncognita;
  }

  private convertirPalabraIncognita(palabraRandomRecibida:string)
  {
    let lenghtPalabraRecibida = palabraRandomRecibida.length;
    let arrayIncognito = [];

    for (let i = 0; i < lenghtPalabraRecibida; i++) 
    {
      arrayIncognito[i] = "_";
    }

    console.log(arrayIncognito);
    let stringIncognito = arrayIncognito.toString();
    
    do {

      stringIncognito = stringIncognito.replace(',',' ');
        console.log(stringIncognito);

      }while (stringIncognito.includes(",") == true)
    

    // Necesito limpiar (por usos anteriores si los hay) a mi array de palabrashowed)
    do
    {
      this.palabraShowed.pop();
    }while(this.palabraShowed.length >= 1);

   
    for (let j = 0; j < palabraRandomRecibida.length; j++) 
    {
      this.palabraShowed.push("_");
    }

    //----------

    console.log(stringIncognito);
    return stringIncognito;
  }

  private limpiarLetrasProbadas()  
  {
    if (this.letrasProbadas.length >= 1)
    {
        do
        {
          this.letrasProbadas.pop();
        }while(this.letrasProbadas.length >= 1);
      }
  }

  private async guardarPuntuacion()
  {
    /*------------------- GUARDO AL RANKING -----------------*/
    let fechaOcurrencia = new Date();
    let stringDate = fechaOcurrencia.toLocaleDateString();
    let puntaje = this.vidas + 1;
    // Add a new document with a generated id. (TENGO EN "DocRef" la referencia a ese usuario si me hiciese falta)
    const docRef = await addDoc(collection(db, "Ranking_ahorcado"), 
    {
      mail: this.usuario,
      puntuacion: puntaje,
      fecha: stringDate,
    });

    console.log("Puntuacion guardada");
    /*-------------------------------------------------------*/
  }
  

}
