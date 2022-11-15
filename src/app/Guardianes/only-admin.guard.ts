import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { app } from '../app.component';
import { RespuestasEncuestaComponent } from '../modulo-seccion-administrador/respuestas-encuesta/respuestas-encuesta.component';

@Injectable({
  providedIn: 'root'
})
export class OnlyAdminGuard implements CanActivate {

  async canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Promise<boolean | UrlTree>
  {
    let resultado = true;

    let administradores = await this.leerAdministradoresDB();
    administradores.forEach((elem) =>{ if (elem.mail == RespuestasEncuestaComponent.prototype.mailShowed){resultado = true}})

    return true;
  }
  public async leerAdministradoresDB()
  {
    const db = getFirestore(app);
    const usuarios = collection(db, "Usuarios");

    let arrayAdministradores = new Array();

    const querySnapshot = await getDocs(usuarios);
    querySnapshot.forEach((doc) => 
    {
      //creo el usuario y le agrego la data
      let user = 
      {
        mail: doc.data()['mail'],
        password: doc.data()['password'],
      }

      if (user.mail == "administrador@gmail.com")
      {
        arrayAdministradores.push(user);
      }
      
    });

    return arrayAdministradores;
  }

}
