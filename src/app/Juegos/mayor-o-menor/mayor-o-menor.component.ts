import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-mayor-o-menor',
  templateUrl: './mayor-o-menor.component.html',
  styleUrls: ['./mayor-o-menor.component.css']
})
export class MayorOMenorComponent 
{

  juegoIniciado = false;
  todosLosNumerosRevelados = false;
  numerosMayorOMenor = new Array(1,2,3,4,5,6,7,8,9,10);

  numerosMostrados = new Array();
  stringNumerosProbados = "Acá se muestran los numeros ya vistos";

  mensajeTemporal = "Este es un mensaje temporal";

  vidas = 3;
  puntaje = 0;

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

        let btnComenzar = document.getElementById("btnComenzar");
        btnComenzar?.removeAttribute("hidden");

        let btnMayor = document.getElementById("btnMayor");
        btnMayor?.removeAttribute("hidden");

        let btnMenor = document.getElementById("btnMenor");
        btnMenor?.removeAttribute("hidden");


        this.flagEstaLogeado = true;
      } 
      else 
      {
        //Si el usuario no esta logeado
        let labelError = document.getElementById("error-login-message");
        labelError?.removeAttribute("hidden");

        let btnComenzar = document.getElementById("btnComenzar");
        btnComenzar?.setAttribute("hidden","true"); 

        let btnMayor = document.getElementById("btnMayor");
        btnMayor?.setAttribute("hidden","true"); 

        let btnMenor = document.getElementById("btnMenor");
        btnMenor?.setAttribute("hidden","true"); 
      }
    });

  }

  public comenzarJuego()
  {
    this.vidas = 3;
    this.puntaje = 0;
    this.numerosMayorOMenor = [1,2,3,4,5,6,7,8,9,10];

    this.limpiarNumerosMostrados();
    let numeroRandom = this.pickearNumeroRandom();
    this.mostrarCarta(numeroRandom);

    this.numerosMostrados.push(numeroRandom);
    this.actualizarNumerosMostrados();

    this.desconsiderarCarta(numeroRandom);
    console.log(this.numerosMayorOMenor);
    this.juegoIniciado = true;
    this.todosLosNumerosRevelados = false;
  }

  public esMayor()
  {
    if(this.juegoIniciado == true && this.todosLosNumerosRevelados == false)
    {
      let numeroRandomGenerado = this.pickearNumeroRandom();

      let lastItem = this.numerosMostrados.length -1;

      if (this.numerosMostrados[lastItem] < numeroRandomGenerado)
      {

        this.puntaje = this.puntaje + 100;
        this.mostrarMensajeTemporal("¡Bien!");
      }
      else
      {
        if (this.puntaje > 0) {this.puntaje = this.puntaje - 100;}

        this.vidas--;
        
        if (this.vidas <= 0)
        {
          this.juegoIniciado = false;
        }

        this.mostrarMensajeTemporal("¡Mal!");
      }

      this.mostrarCarta(numeroRandomGenerado);
      this.desconsiderarCarta(numeroRandomGenerado);
      this.numerosMostrados.push(numeroRandomGenerado);
      this.actualizarNumerosMostrados();

      if (this.numerosMostrados.length == 10)
      {
        this.todosLosNumerosRevelados = true;
      }
    }
    else
    {
      if (this.juegoIniciado == false)
      { 
        this.mostrarMensajeTemporal("¡El juego no está iniciado!");
      }
      else if (this.todosLosNumerosRevelados == true)
      { 
        this.mostrarMensajeTemporal("¡El juego finalizó, todos los números fueron mostrados!");
      }
    }
  }

  public esMenor()
  {
    if(this.juegoIniciado == true && this.todosLosNumerosRevelados == false)
    {
      let numeroRandomGenerado = this.pickearNumeroRandom();

      let lastItem = this.numerosMostrados.length -1;

      if (this.numerosMostrados[lastItem] > numeroRandomGenerado)
      {

        this.puntaje = this.puntaje + 100;
        this.mostrarMensajeTemporal("¡Bien!");
      }
      else
      {
        if (this.puntaje > 0) {this.puntaje = this.puntaje - 100;}

        this.vidas--;
        
        if (this.vidas <= 0)
        {
          this.juegoIniciado = false;
        }

        this.mostrarMensajeTemporal("¡Mal!");
      }

      this.mostrarCarta(numeroRandomGenerado);
      this.desconsiderarCarta(numeroRandomGenerado);
      this.numerosMostrados.push(numeroRandomGenerado);
      this.actualizarNumerosMostrados();

      if (this.numerosMostrados.length == 10)
      {
        this.todosLosNumerosRevelados = true;
      }
    }
    else
    {
      if (this.juegoIniciado == false)
      { 
        this.mostrarMensajeTemporal("¡El juego no está iniciado!");
      }
      else if (this.todosLosNumerosRevelados == true)
      { 
        this.mostrarMensajeTemporal("¡El juego finalizó, todos los números fueron mostrados!");
      }
    }
  }

  //(Pickea un num random del 1 al 10)
  private pickearNumeroRandom()
  {
    //Me traigo un numero random del indice 0 al indice max del array
    let lenghtActual = this.numerosMayorOMenor.length - 1;
    let lenghtFormula = lenghtActual - 1;

    // Traigo un numero del 0 al 9
    let numeroRandomBin = Math.random(); 
    let calculo = Math.floor(numeroRandomBin * (lenghtFormula - 0 + 1));
    calculo++;

    if (this.numerosMayorOMenor.length == 1)
    {
      calculo = 0;
    }

    let indiceRandom = calculo;

    console.log("INDICE RANDOM: " + indiceRandom);
    let numeroRandom = this.numerosMayorOMenor[indiceRandom];
      
    return numeroRandom;
  }

  private mostrarCarta(numeroCarta:number)
  {
      let carta1 = document.getElementById("img-card1");
      let carta2 = document.getElementById("img-card2");
      let carta3 = document.getElementById("img-card3");
      let carta4 = document.getElementById("img-card4");
      let carta5 = document.getElementById("img-card5");
      let carta6 = document.getElementById("img-card6");
      let carta7 = document.getElementById("img-card7");
      let carta8 = document.getElementById("img-card8");
      let carta9 = document.getElementById("img-card9");
      let carta10 = document.getElementById("img-card10");

      switch (numeroCarta) 
      {
        case 1:
        {
          carta1?.removeAttribute("hidden");

          carta2?.setAttribute("hidden","true");
          carta3?.setAttribute("hidden","true");
          carta4?.setAttribute("hidden","true");
          carta5?.setAttribute("hidden","true");
          carta6?.setAttribute("hidden","true");
          carta7?.setAttribute("hidden","true");
          carta8?.setAttribute("hidden","true");
          carta9?.setAttribute("hidden","true");
          carta10?.setAttribute("hidden","true");
          break;
        }
        case 2:
        {
          carta2?.removeAttribute("hidden");

          carta1?.setAttribute("hidden","true");
          carta3?.setAttribute("hidden","true");
          carta4?.setAttribute("hidden","true");
          carta5?.setAttribute("hidden","true");
          carta6?.setAttribute("hidden","true");
          carta7?.setAttribute("hidden","true");
          carta8?.setAttribute("hidden","true");
          carta9?.setAttribute("hidden","true");
          carta10?.setAttribute("hidden","true");
          break;
        }
        case 3:
        {
          carta3?.removeAttribute("hidden");

          carta1?.setAttribute("hidden","true");
          carta2?.setAttribute("hidden","true");
          carta4?.setAttribute("hidden","true");
          carta5?.setAttribute("hidden","true");
          carta6?.setAttribute("hidden","true");
          carta7?.setAttribute("hidden","true");
          carta8?.setAttribute("hidden","true");
          carta9?.setAttribute("hidden","true");
          carta10?.setAttribute("hidden","true");
          break;
        }
        case 4:
        {
          carta4?.removeAttribute("hidden");

          carta1?.setAttribute("hidden","true");
          carta2?.setAttribute("hidden","true");
          carta3?.setAttribute("hidden","true");
          carta5?.setAttribute("hidden","true");
          carta6?.setAttribute("hidden","true");
          carta7?.setAttribute("hidden","true");
          carta8?.setAttribute("hidden","true");
          carta9?.setAttribute("hidden","true");
          carta10?.setAttribute("hidden","true");
          break;
        }
        case 5:
        {
          carta5?.removeAttribute("hidden");

          carta1?.setAttribute("hidden","true");
          carta2?.setAttribute("hidden","true");
          carta3?.setAttribute("hidden","true");
          carta4?.setAttribute("hidden","true");
          carta6?.setAttribute("hidden","true");
          carta7?.setAttribute("hidden","true");
          carta8?.setAttribute("hidden","true");
          carta9?.setAttribute("hidden","true");
          carta10?.setAttribute("hidden","true");
          break;
        }
        case 6:
        {
          carta6?.removeAttribute("hidden");

          carta1?.setAttribute("hidden","true");
          carta2?.setAttribute("hidden","true");
          carta3?.setAttribute("hidden","true");
          carta4?.setAttribute("hidden","true");
          carta5?.setAttribute("hidden","true");
          carta7?.setAttribute("hidden","true");
          carta8?.setAttribute("hidden","true");
          carta9?.setAttribute("hidden","true");
          carta10?.setAttribute("hidden","true");
          break;
        }
        case 7:
        {
          carta7?.removeAttribute("hidden");

          carta1?.setAttribute("hidden","true");
          carta2?.setAttribute("hidden","true");
          carta3?.setAttribute("hidden","true");
          carta4?.setAttribute("hidden","true");
          carta5?.setAttribute("hidden","true");
          carta6?.setAttribute("hidden","true");
          carta8?.setAttribute("hidden","true");
          carta9?.setAttribute("hidden","true");
          carta10?.setAttribute("hidden","true");
          break;
        }
        case 8:
        {
          carta8?.removeAttribute("hidden");

          carta1?.setAttribute("hidden","true");
          carta2?.setAttribute("hidden","true");
          carta3?.setAttribute("hidden","true");
          carta4?.setAttribute("hidden","true");
          carta5?.setAttribute("hidden","true");
          carta6?.setAttribute("hidden","true");
          carta7?.setAttribute("hidden","true");
          carta9?.setAttribute("hidden","true");
          carta10?.setAttribute("hidden","true");
          break;
        }
        case 9:
        {
          carta9?.removeAttribute("hidden");

          carta1?.setAttribute("hidden","true");
          carta2?.setAttribute("hidden","true");
          carta3?.setAttribute("hidden","true");
          carta4?.setAttribute("hidden","true");
          carta5?.setAttribute("hidden","true");
          carta6?.setAttribute("hidden","true");
          carta7?.setAttribute("hidden","true");
          carta8?.setAttribute("hidden","true");
          carta10?.setAttribute("hidden","true");
          break;
        }
        case 10:
        {
          carta10?.removeAttribute("hidden");

          carta1?.setAttribute("hidden","true");
          carta2?.setAttribute("hidden","true");
          carta3?.setAttribute("hidden","true");
          carta4?.setAttribute("hidden","true");
          carta5?.setAttribute("hidden","true");
          carta6?.setAttribute("hidden","true");
          carta7?.setAttribute("hidden","true");
          carta8?.setAttribute("hidden","true");
          carta9?.setAttribute("hidden","true");
          break;
        }
      }
  }

  private desconsiderarCarta(numeroDeCartaRecibido:number)
  {
    let nuevosNumeros = new Array();

    switch (numeroDeCartaRecibido) 
    {
      case 1:
      {
        nuevosNumeros = this.numerosMayorOMenor.filter( (numeroDeCartaRecibido) => 
        {
          if (numeroDeCartaRecibido != 1) {return true} 
          else {return false}; 
        });

        break;
      }
      case 2:
      {
        nuevosNumeros = this.numerosMayorOMenor.filter( (numeroDeCartaRecibido) => 
        {
          if (numeroDeCartaRecibido != 2) {return true} 
          else {return false}; 
        });

        break;
      }
      case 3:
      {
        nuevosNumeros = this.numerosMayorOMenor.filter( (numeroDeCartaRecibido) => 
        {
          if (numeroDeCartaRecibido != 3) {return true} 
          else {return false}; 
        });

        break;
      }
      case 4:
      {
        nuevosNumeros = this.numerosMayorOMenor.filter( (numeroDeCartaRecibido) => 
        {
          if (numeroDeCartaRecibido != 4) {return true} 
          else {return false}; 
        });
        break;
      }

      case 5:
      {
        nuevosNumeros = this.numerosMayorOMenor.filter( (numeroDeCartaRecibido) => 
        {
            if (numeroDeCartaRecibido != 5) {return true} 
            else {return false}; 
        });

        break;
      }
      case 6:
      {
        nuevosNumeros = this.numerosMayorOMenor.filter( (numeroDeCartaRecibido) => 
        {
          if (numeroDeCartaRecibido != 6) {return true} 
          else {return false}; 
        });

        break;
      }
      case 7:
      {
        nuevosNumeros = this.numerosMayorOMenor.filter( (numeroDeCartaRecibido) => 
        {
          if (numeroDeCartaRecibido != 7) {return true} 
          else {return false}; 
        });

        break;
      }
      case 8:
      {
        nuevosNumeros = this.numerosMayorOMenor.filter( (numeroDeCartaRecibido) => 
        {
          if (numeroDeCartaRecibido != 8) {return true} 
          else {return false}; 
        });

        break;
      }
      case 9:
      {
        nuevosNumeros = this.numerosMayorOMenor.filter( (numeroDeCartaRecibido) => 
        {
          if (numeroDeCartaRecibido != 9) {return true} 
          else {return false}; 
        });

        break;
      }
      case 10:
      {
        nuevosNumeros = this.numerosMayorOMenor.filter( (numeroDeCartaRecibido) => 
        {
          if (numeroDeCartaRecibido != 10) {return true} 
          else {return false}; 
        });

        break;
      }
    }

    this.numerosMayorOMenor = nuevosNumeros;
  }

  private limpiarNumerosMostrados()  
  {
    if (this.numerosMayorOMenor.length >= 1)
    {
      do { this.numerosMostrados.pop(); }while(this.numerosMostrados.length >= 1);
    }
  }

  private actualizarNumerosMostrados()
  {
    this.stringNumerosProbados = this.numerosMostrados.toString();
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
    }, 2500)
  }

}
