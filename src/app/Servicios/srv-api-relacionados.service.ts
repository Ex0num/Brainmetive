import { Injectable } from '@angular/core';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../app.component';
import { Adivinanza } from '../Entidades/adivinanza';

@Injectable({
  providedIn: 'root'
})
export class SrvApiRelacionadosService 
{
  db = getFirestore(app);
  adivinanzasDB = new Array();

  constructor() {}

  adivinanzaActual:Adivinanza = new Adivinanza("aux",["a"]);

  // ------------------ Solo utilizar 1 vez ---------------------------------------

  public async traerTodasLasPreguntas()
  {
    let mensajesRef = collection(this.db, "Relacionados");
    let querySnapshot = getDocs(mensajesRef);

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      let newAdivinanza = new Adivinanza(doc.data()["palabra"], doc.data()["link_api_img"]);
      this.adivinanzasDB.push(newAdivinanza);
    });

    console.log(this.adivinanzasDB);
  }
  
  // ------------------ Metodos utilizables del servicio ----------------------------

  public buscarUnaAdivinanzaRandom()
  {
    let posicionRandom:number = this.pickearNumeroRandom();

    let preguntaObtenidaRandom;
    preguntaObtenidaRandom = this.adivinanzasDB[posicionRandom];

    return preguntaObtenidaRandom;
  }

  //---------------------------------------------------------------------------------

  //(Pickea un num random del 1 al 10)
  private pickearNumeroRandom()
  {
    //Me traigo un numero random del indice 0 al indice max del array
    let lenghtActual = this.adivinanzasDB.length - 1;
  

    // Traigo un numero del 0 al maxlenght
    let numeroRandomBin = Math.random(); 
    let calculo = Math.floor(numeroRandomBin * (lenghtActual - 0 + 1));

    if (this.adivinanzasDB.length == 1)
    {
      calculo = 0;
    }

    let indiceRandom = calculo;
      
    return indiceRandom;
  }
}

