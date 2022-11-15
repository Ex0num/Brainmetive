import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import { AppComponent } from 'src/app/app.component';
import { Log } from 'src/app/Entidades/log';
import { db } from 'src/app/Vistas/login/login.component';

@Component({
  selector: 'app-respuestas-encuesta',
  templateUrl: './respuestas-encuesta.component.html',
  styleUrls: ['./respuestas-encuesta.component.css']
})
export class RespuestasEncuestaComponent implements OnInit {

  mailShowed:any;

  constructor() {}

  ngOnInit() 
  {
    this.obtenerSesion();
    this.leerEncuestasDB();
  }

  public arrayEncuestasLeidas:any[] = [];

  async leerEncuestasDB() 
  {
    //Obtengo los documentos de forma asincronica, con un await. Por cada documento creo un usuario le asigno los datos y lo guardo
    const querySnapshot = await getDocs(collection(db, "Encuestas"));
    querySnapshot.forEach((doc) => 
    {
        // imprimo la data
        console.log(doc.id, " => ", doc.data());

        //creo el log y le agrego la data
        let encuestaLeida = 
        {
          apellido: doc.data()['apellido'],
          comentario: doc.data()['comentario'],
          edad: doc.data()['edad'],
          nombre: doc.data()['nombre'],
          numero: doc.data()['numero'],
          rol: doc.data()['rol']
        }
       
        console.log(encuestaLeida);

        this.arrayEncuestasLeidas.push(encuestaLeida);
    });
  }

  async obtenerSesion()
  {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => 
    {
      if (user) 
      {

        //Si el usuario esta logeado
        //..
        this.mailShowed = user.email;

        console.log("LOGEADO!!!");
        console.log(this.mailShowed);

        // ...
      } else 
      {
        // User is signed out
        // ...
        //Si el usuario no esta logeado
        //..

        console.log("DESLOGEADO!!");
      }
    });
  }
}
