import { Component, OnInit } from '@angular/core';
import { Pregunta } from 'src/app/Entidades/pregunta';
import { SrvApiPreguntadosService } from 'src/app/Servicios/srv-api-preguntados.service';
import { interval } from 'rxjs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { app } from 'src/app/app.component';

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const Encuestas = collection(db, "Encuestas");

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css']
})
export class PreguntadosComponent implements OnInit{

  servicioApi: SrvApiPreguntadosService;
  
  titulo = "¿Cuál es la opción correcta considerando la opción correcta?";
  timeleft:number = 15;
  interval:any;

  juegoTerminado = true;

  vidas = 3;
  puntaje = 0;

  flagEstaLogeado = false;
  usuario:any;
  usuarioID:any;

  constructor(public servicioApiRecieved: SrvApiPreguntadosService) 
  {
    this.servicioApi = servicioApiRecieved;

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

  ngOnInit(): void 
  {
    console.log("TRAYENDO TODAS LAS PREGUNTAS");
    this.servicioApi.traerTodasLasPreguntas();
  }

  public async startTrivia()
  {
    console.log("Comenzando trivia...");
    this.vidas = 3;
    this.puntaje = 0;
    this.juegoTerminado = false;
    await this.iniciarPreguntaRandom();
    
    let expositorPreguntas = document.getElementById("form-questions");
    expositorPreguntas?.removeAttribute("hidden");

    let comenzarBtn = document.getElementById("link");
    comenzarBtn?.setAttribute("hidden","true");

    let puntuacionFinalElement = document.getElementById("final-pts");
    puntuacionFinalElement?.setAttribute("hidden","true");
  }

  private async iniciarPreguntaRandom()
  {
    if (this.vidas > 0)
    {
      let preguntaRandomObtenida = await this.servicioApi.buscarUnaPreguntaRandom();
      this.mostrarPregunta(preguntaRandomObtenida);
      this.iniciarTemporizador();
    }
    else
    {
      console.log("JUEGO TERMINADO" + " PUNTAJE: " + this.puntaje);
      this.terminarJuego();
    }
  }

  private terminarJuego() 
  {
    let expositorPreguntas = document.getElementById("form-questions");
    expositorPreguntas?.setAttribute("hidden","true");

    let comenzarBtn = document.getElementById("link");
    comenzarBtn?.removeAttribute("hidden");
    this.juegoTerminado = true;
    this.mostrarPuntuacionFinal();

    this.guardarPuntuacion();
  }

  private mostrarPregunta(preguntaRandomObtenida: Pregunta) 
  { 
    let imagePreguntaElement = document.getElementById("question-img");
    let opcion1 = document.getElementById("opcion1");
    let opcion2 = document.getElementById("opcion2");
    let opcion3 = document.getElementById("opcion3");
    let opcion4 = document.getElementById("opcion4");

    this.titulo = preguntaRandomObtenida.pregunta;
    imagePreguntaElement?.setAttribute("src", preguntaRandomObtenida.link_api_img);
    opcion1?.setAttribute("value",preguntaRandomObtenida.opciones[0]);
    opcion2?.setAttribute("value",preguntaRandomObtenida.opciones[1]);
    opcion3?.setAttribute("value",preguntaRandomObtenida.opciones[2]);
    opcion4?.setAttribute("value",preguntaRandomObtenida.opciones[3]);

    this.servicioApi.preguntaActual = preguntaRandomObtenida;
  } 

  private iniciarTemporizador()
  {
    const source = interval(1000);

    clearInterval(this.interval);

    this.timeleft = 15;
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
            this.vidas--;
            
            this.iniciarPreguntaRandom();
            this.iniciarTemporizador();
          }
      }
      

    },1000)
  }

  public async opcionElegida(nroOpcionElegidaRecibida:number)
  {
    let bienMessage = document.getElementById("label-correct"); 
    let malMessage = document.getElementById("label-incorrect");

    //Lo comparo con el indice del array de la pregunta actual
    if (nroOpcionElegidaRecibida -1 == this.servicioApi.preguntaActual.nroOpcionCorrecta -1)
    {
      console.log("BIEN");
      this.puntaje++;
      bienMessage?.removeAttribute("hidden");
    }
    else
    {
      console.log("MAL");
      malMessage?.removeAttribute("hidden");
      this.vidas--;
    }

    console.log("VIDAS: " + this.vidas);

    await setTimeout( () => {
      bienMessage?.setAttribute("hidden","true");
      malMessage?.setAttribute("hidden","true");
    },2000);

    this.iniciarTemporizador();
    this.iniciarPreguntaRandom();
  }

  private mostrarPuntuacionFinal()
  {
    let puntuacionFinalElement = document.getElementById("final-pts");
    puntuacionFinalElement?.removeAttribute("hidden");
  }

  private async guardarPuntuacion()
  {
    /*------------------- GUARDO AL RANKING -----------------*/
    let fechaOcurrencia = new Date();
    let stringDate = fechaOcurrencia.toLocaleDateString();
    let puntaje = this.puntaje;
    // Add a new document with a generated id. (TENGO EN "DocRef" la referencia a ese usuario si me hiciese falta)
    const docRef = await addDoc(collection(db, "Ranking_preguntados"), 
    {
      mail: this.usuario,
      puntuacion: puntaje,
      fecha: stringDate,
    });

    console.log("Puntuacion guardada");
    /*-------------------------------------------------------*/
  }

}
