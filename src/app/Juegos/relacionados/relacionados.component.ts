import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { interval } from 'rxjs';
import { app } from 'src/app/app.component';
import { Adivinanza } from 'src/app/Entidades/adivinanza';
import { SrvApiRelacionadosService } from 'src/app/Servicios/srv-api-relacionados.service';

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const Encuestas = collection(db, "Encuestas");

@Component({
  selector: 'app-relacionados',
  templateUrl: './relacionados.component.html',
  styleUrls: ['./relacionados.component.css']
})
export class RelacionadosComponent
{
  puntaje = 0;

  timeleft:number = 90;
  interval:any;

  juegoTerminado = true;

  casilleros = new Array();
  adivinanzaActual = new Adivinanza("aux",["aux"]);

  flagEstaLogeado = false;
  usuario:any;
  usuarioID:any;

  constructor(public servicioApi: SrvApiRelacionadosService) 
  {
    this.servicioApi.traerTodasLasPreguntas();
  
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
        this.flagEstaLogeado = true;

        let labelError = document.getElementById("error-login-message");
        labelError?.setAttribute("hidden","true"); 
      } 
      else 
      {
        //Si el usuario no esta logeado
        let labelError = document.getElementById("error-login-message");
        labelError?.removeAttribute("hidden");

        let btnComenzar = document.getElementById("link");
        btnComenzar?.setAttribute("hidden","true"); 
      }
    });
  }

  public async startTrivia()
  {
    console.log();

    this.juegoTerminado = false;
    await this.iniciarAdivinanzaRandom();

    let expositorPreguntas = document.getElementById("form-game");
    expositorPreguntas?.removeAttribute("hidden");

    let comenzarBtn = document.getElementById("link");
    comenzarBtn?.setAttribute("hidden","true");

    let puntuacionFinalElement = document.getElementById("final-pts");
    puntuacionFinalElement?.setAttribute("hidden","true");
  }

  private async iniciarAdivinanzaRandom()
  {
    let adivinanzaRandomObtenida = await this.servicioApi.buscarUnaAdivinanzaRandom();
    this.adivinanzaActual = adivinanzaRandomObtenida;
    this.mostrarAdivinanzaFotos(adivinanzaRandomObtenida);
    this.iniciarTemporizador();
  }

  private mostrarAdivinanzaFotos(adivinanzaRandomRecibida:Adivinanza)
  {
    let img1 = document.getElementById("game-img-1");
    let img2 = document.getElementById("game-img-2");

    img1?.setAttribute("src", adivinanzaRandomRecibida.link_api_img[0]);
    img2?.setAttribute("src", adivinanzaRandomRecibida.link_api_img[1]);

    this.servicioApi.adivinanzaActual = adivinanzaRandomRecibida;
  }

  private iniciarTemporizador()
  {
    clearInterval(this.interval);

    this.timeleft = 90;
    let flagTiempoAcabado = false;

    this.interval = setInterval(() => 
    {

      if (this.juegoTerminado == true)
      {
        clearInterval(this.interval);
      }
      else
      {
          if(this.timeleft > 0 && flagTiempoAcabado == false) 
          {
            this.timeleft--;
          } 
          else
          {
            flagTiempoAcabado = true;
            this.terminarJuego();
          }
      }

    },1000)
  }
  
  private terminarJuego() 
  {
    this.limpiarCasilleros();
    let expositorAdivinanzas = document.getElementById("form-game");
    expositorAdivinanzas?.setAttribute("hidden","true");

    let comenzarBtn = document.getElementById("link");
    comenzarBtn?.removeAttribute("hidden");
    this.juegoTerminado = true;
    this.mostrarPuntuacionFinal();

    this.guardarPuntuacion();
  }

  private mostrarPuntuacionFinal() 
  {
    let puntuacionFinalElement = document.getElementById("final-pts");
    puntuacionFinalElement?.removeAttribute("hidden");
  }

  public letraClickeada(letraClickeada:string)
  {
      switch (letraClickeada)
      {
        case 'Borrar':
        {
          this.limpiarCasilleros();
          break;
        }
        case 'Probar':
        {
          // this.probarLetras();
          break;
        }
        default:
        {
          this.agregarLetra(letraClickeada);
          break;
        }
      }
  }

 private agregarLetra(letraRecibida:string)
 {
    if (this.casilleros.length < 10)
    {
      this.casilleros.push(letraRecibida);
      this.actualizarCasilleros();
    }
    else
    {
      console.log("YA NO ENTRAN MAS LETRAS");
    }
 }

 public limpiarCasilleros()
 {
    do
    {
      this.casilleros.pop();
    }while(this.casilleros.length >= 1);

    this.actualizarCasilleros();
 }

 public async probarPalabra()
 {
    let palabraDetectada = this.casilleros.toString();
    let palabraDetectadaLimpia = palabraDetectada.trim().replace(",","");
    do
    {
      palabraDetectadaLimpia = palabraDetectadaLimpia.trim().replace(",","");
    }
    while(palabraDetectadaLimpia.includes(","));

    if (this.adivinanzaActual.palabra.toUpperCase() == palabraDetectadaLimpia)
    {
      console.log("COINCIDENCIA");
      this.puntaje++;
      
      this.mostrarFelicitacion();
      this.limpiarCasilleros();
      let adivinanzaRandomObtenida = await (this.servicioApi.buscarUnaAdivinanzaRandom());
      this.adivinanzaActual = adivinanzaRandomObtenida;
      this.mostrarAdivinanzaFotos(adivinanzaRandomObtenida);
    }
    else
    {
      console.log("ERROR");
      this.mostrarError();
    }
 }

 private actualizarCasilleros()
 {

    let casillero1 = document.getElementById("casilla1");
    let casillero2 = document.getElementById("casilla2");
    let casillero3 = document.getElementById("casilla3");
    let casillero4 = document.getElementById("casilla4");
    let casillero5 = document.getElementById("casilla5");
    let casillero6 = document.getElementById("casilla6");
    let casillero7 = document.getElementById("casilla7");
    let casillero8 = document.getElementById("casilla8");
    let casillero9 = document.getElementById("casilla9");
    let casillero10 = document.getElementById("casilla10");

    let arrayCasilleros = new Array();

    arrayCasilleros.push(casillero1);
    arrayCasilleros.push(casillero2);
    arrayCasilleros.push(casillero3);
    arrayCasilleros.push(casillero4);
    arrayCasilleros.push(casillero5);
    arrayCasilleros.push(casillero6);
    arrayCasilleros.push(casillero7);
    arrayCasilleros.push(casillero8);
    arrayCasilleros.push(casillero9);
    arrayCasilleros.push(casillero10);

    arrayCasilleros.forEach( (element, index)=>
    {
      if (this.casilleros[index] != null)
      {
        element.setAttribute("value", this.casilleros[index]);
      }
      else
      {
        element.setAttribute("value", "");
      }
    }) 
 }

 private mostrarError()
 {
  let lblIncorrect = document.getElementById("label-incorrect");
  lblIncorrect?.removeAttribute("hidden");

  setTimeout( ()=> 
  {
    lblIncorrect?.setAttribute("hidden","true");
  }, 1500)
 }

 private mostrarFelicitacion()
 {
  let lblCorrect = document.getElementById("label-correct");
  lblCorrect?.removeAttribute("hidden");

  setTimeout( ()=> 
  {
    lblCorrect?.setAttribute("hidden","true");
  }, 1500)
 }

 private async guardarPuntuacion()
  {
    /*------------------- GUARDO AL RANKING -----------------*/
    let fechaOcurrencia = new Date();
    let stringDate = fechaOcurrencia.toLocaleDateString();
    let puntaje = this.puntaje;
    // Add a new document with a generated id. (TENGO EN "DocRef" la referencia a ese usuario si me hiciese falta)
    const docRef = await addDoc(collection(db, "Ranking_relaciona2"), 
    {
      mail: this.usuario,
      puntuacion: puntaje,
      fecha: stringDate,
    });

    console.log("Puntuacion guardada");
    /*-------------------------------------------------------*/
  }

}
