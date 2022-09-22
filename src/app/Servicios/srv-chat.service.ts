import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList,  } from '@angular/fire/compat/database';
import { Mensaje } from '../Entidades/mensaje';

@Injectable({
  providedIn: 'root'
})

export class ChatService 
{
  dbPath: string =  'mensajes';
  mensajesRef!: AngularFireList<Mensaje>;

  constructor(private dbRT: AngularFireDatabase) 
  {
    this.mensajesRef = dbRT.list(this.dbPath);
  }

  addMensaje(mensaje: Mensaje)
  {
    this.mensajesRef.push(mensaje);
  }

  getMensajesList(): AngularFireList<Mensaje>
  {
    return this.mensajesRef;
  }
  
  
}