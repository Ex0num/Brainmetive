import { Component, OnInit } from '@angular/core';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from 'src/app/app.component';
import { RankingPlayer } from 'src/app/Entidades/ranking-player';
import { Usuario } from 'src/app/Entidades/usuario';

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const Usuarios = collection(db, "Usuarios");

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit 
{

  ahorcadoPlayers = new Array();
  mayorOmenorPlayers = new Array();
  preguntadosPlayers = new Array();
  relaciona2Players = new Array();

  constructor() {}
  ngOnInit(): void 
  {
    this.cargarAhorcadoPlayers();
    this.cargarMayorOMenorPlayers();
    this.cargarPreguntadosPlayers();
    this.cargarRelaciona2Players();
  }

  private async cargarAhorcadoPlayers()
  {
      //Obtengo los documentos de forma asincronica, con un await. Por cada documento creo un usuario le asigno los datos y lo guardo
      const querySnapshot = await getDocs(collection(db, "Ranking_ahorcado"));
      querySnapshot.forEach((doc) => 
      {
          // imprimo la data
          let userRank = new RankingPlayer(doc.data()['fecha'], doc.data()['mail'], doc.data()['puntuacion']);
          this.ahorcadoPlayers.push(userRank);
      });

      this.ahorcadoPlayers = this.ahorcadoPlayers.sort((firstEl,secondEl)=> secondEl.puntuacion - firstEl.puntuacion);
  }

  private async cargarMayorOMenorPlayers()
  {
      //Obtengo los documentos de forma asincronica, con un await. Por cada documento creo un usuario le asigno los datos y lo guardo
      const querySnapshot = await getDocs(collection(db, "Ranking_mayoromenor"));
      querySnapshot.forEach((doc) => 
      {
          // imprimo la data
          let userRank = new RankingPlayer(doc.data()['fecha'], doc.data()['mail'], doc.data()['puntuacion']);
          this.mayorOmenorPlayers.push(userRank);
      });

      this.mayorOmenorPlayers = this.mayorOmenorPlayers.sort((firstEl,secondEl)=> secondEl.puntuacion - firstEl.puntuacion);
  }

  private async cargarPreguntadosPlayers()
  {
      //Obtengo los documentos de forma asincronica, con un await. Por cada documento creo un usuario le asigno los datos y lo guardo
      const querySnapshot = await getDocs(collection(db, "Ranking_preguntados"));
      querySnapshot.forEach((doc) => 
      {
          // imprimo la data
          let userRank = new RankingPlayer(doc.data()['fecha'], doc.data()['mail'], doc.data()['puntuacion']);
          this.preguntadosPlayers.push(userRank);
      });

      this.preguntadosPlayers = this.preguntadosPlayers.sort((firstEl,secondEl)=> secondEl.puntuacion - firstEl.puntuacion);
  }

  private async cargarRelaciona2Players()
  {
      //Obtengo los documentos de forma asincronica, con un await. Por cada documento creo un usuario le asigno los datos y lo guardo
      const querySnapshot = await getDocs(collection(db, "Ranking_relaciona2"));
      querySnapshot.forEach((doc) => 
      {
          // imprimo la data
          let userRank = new RankingPlayer(doc.data()['fecha'], doc.data()['mail'], doc.data()['puntuacion']);
          this.relaciona2Players.push(userRank);
      });

      this.relaciona2Players = this.relaciona2Players.sort((firstEl,secondEl)=> secondEl.puntuacion - firstEl.puntuacion);
  }
}
