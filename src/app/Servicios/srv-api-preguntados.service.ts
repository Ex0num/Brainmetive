import { Injectable, OnInit } from '@angular/core';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../app.component';
import { Pregunta } from '../Entidades/pregunta';

@Injectable({
  providedIn: 'root'
})
export class SrvApiPreguntadosService
{
  db = getFirestore(app);
  preguntasDB = new Array();

  constructor() {}

  preguntaActual:Pregunta = new Pregunta("aux","aux",["aux"],2);

  // ------------------ Solo utilizar 1 vez ----------------------------

  public async traerTodasLasPreguntas()
  {
    let mensajesRef = collection(this.db, "Preguntados");
    let querySnapshot = getDocs(mensajesRef);

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      let newPregunta = new Pregunta(doc.data()["link_api_img"], doc.data()["pregunta"], doc.data()["opciones"], doc.data()["nroOpcionCorrecta"]);
      this.preguntasDB.push(newPregunta);
    });

    console.log(this.preguntasDB);
  }
  
  // ------------------ Metodos utilizables del servicio ----------------------------

  public buscarUnaPreguntaRandom()
  {
    let posicionRandom:number = this.pickearNumeroRandom();

    let preguntaObtenidaRandom;
    preguntaObtenidaRandom = this.preguntasDB[posicionRandom];

    return preguntaObtenidaRandom;
  }

  //---------------------------------------------------------------------------------

  //(Pickea un num random del 1 al 10)
  private pickearNumeroRandom()
  {
    //Me traigo un numero random del indice 0 al indice max del array
    let lenghtActual = this.preguntasDB.length - 1;
  

    // Traigo un numero del 0 al maxlenght
    let numeroRandomBin = Math.random(); 
    let calculo = Math.floor(numeroRandomBin * (lenghtActual - 0 + 1));

    if (this.preguntasDB.length == 1)
    {
      calculo = 0;
    }

    let indiceRandom = calculo;
      
    return indiceRandom;
  }
}
