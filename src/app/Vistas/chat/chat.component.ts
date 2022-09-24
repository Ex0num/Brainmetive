import { Component } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { app } from 'src/app/app.component';
import { Mensaje } from 'src/app/Entidades/mensaje';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent
{

  db = getFirestore(app);
  // realTimeDB = getDatabase(app); 
  
  mensaje:string = "";

  errorLoginMessage = "";

  usuario:any;
  usuarioID:any;

  flagOwnMessage = false;
  flagLoadingMessages = true;

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

        //Le traigo los mensajes
        // this.updateMessages()
        // this.recievedMessage();
        this.recieveChanges();
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
  
  private async getLastID()
  {
    let mensajesRef = collection(this.db, "Mensajes");
    let querySnapshot = getDocs(mensajesRef);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      if (parseInt(doc.id) > flagMax)
      {
        flagMax = parseInt(doc.id);
        console.log(flagMax);
      }
    });

    return flagMax;
  }

  public async sendMessage()
  {
      //--------------- Guardo al log en la DB ---------------------
      let mensajeEnviado = new Mensaje(this.usuario, this.mensaje);
      //----------------------------------------------------------------

      this.flagOwnMessage = true;

      let lastId = this.getLastID();
      let newID = await lastId + 1;

      // Add a new document in collection "cities"
      await setDoc(doc(this.db, "Mensajes", newID.toString()), 
      {
        usuario: mensajeEnviado.username,
        texto: mensajeEnviado.texto,
        hora: mensajeEnviado.horaActual,
        fecha: mensajeEnviado.fechaActual,
      });

      this.mensaje = "";
  }

  public recieveChanges()
  {
      let newLastID = 0;

      const unsubscribe = onSnapshot(collection(this.db, "Mensajes"), async () => 
      {
          // Respond to data
          if (this.flagLoadingMessages == false)
          {
            console.log("CHANGES DETECTED");

            if (this.flagOwnMessage == true)
            {
              console.log("CREANDO BUBBLE PROPIA");

              let nuevoMensaje = new Mensaje(this.usuario,this.mensaje);
              this.createOwnNewBubble(nuevoMensaje.texto,nuevoMensaje.username,nuevoMensaje.horaActual);
            }
            else
            {
              console.log("CREANDO BUBBLE AJENA");

              let usuarioDetectado = "";
              let textoDetectado = "";

              let mensajesRef = collection(this.db, "Mensajes");
              
              let  lastID = this.getLastID();
              newLastID = await lastID;

              // let q = query(collection(this.db, "Mensajes"), orderBy("fechaActual", "desc"), limit(3));
              // const querySnapshot = await getDocs(q);

              let querySnapshot = getDocs(mensajesRef);

              (await querySnapshot).docs.forEach((doc) => 
              {
                if (parseInt(doc.id) == newLastID)
                {
                  let data = doc.data();
                  let mensajeNuevo = new Mensaje(data['usuario'],data['texto']);
                  this.createNewBubble(mensajeNuevo.texto, mensajeNuevo.username, mensajeNuevo.horaActual);
                }
              });
            }
          }
          else
          {
            console.log("LOADING MESSAGES");
            this.flagLoadingMessages = false;
          }

          //Reestableces flag
          this.flagOwnMessage = false;

          if (newLastID >= 100)
          {
            this.limpiarMensajes();
          }
          
      });
  }

  private async limpiarMensajes() 
  {
    let mensajesRef = collection(this.db, "Mensajes");
    let querySnapshot = getDocs(mensajesRef);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((document) => 
    {
        deleteDoc(doc(this.db, "Mensajes", document.id));
    });

    return flagMax;
  }

  public createNewBubble(mensajeRecieved:string, usernameRecieved:string, horaActual:string)
  {
    let listaMensajes = document.getElementById("chat-messages");

    //Creo el mensaje como tal
    let nuevoMensaje = document.createElement("li");

    let nuevaInfo = document.createElement("p");

    //Creo el nombre y la fecha y la asigno en un label
    //let horaActualCalculada = new Date();
    //let horaString = horaActualCalculada.toLocaleTimeString();
    nuevaInfo.innerHTML = usernameRecieved  + " - " + horaActual;

    //Creo el texto y le asigno el valor recibido
    let nuevoTexto = document.createElement("p");

    let mensajeTruncado = this.textoTruncado(mensajeRecieved);

    nuevoTexto.innerHTML = mensajeTruncado;

    nuevoMensaje.appendChild(nuevaInfo);
    nuevoMensaje.appendChild(nuevoTexto);
    nuevoMensaje.setAttribute("class","othersMessage");
    nuevoMensaje.className = 'othersMessage';

    console.log(nuevoMensaje);
    listaMensajes?.appendChild(nuevoMensaje);
  }

  public createOwnNewBubble(mensajeRecieved:string, usernameRecieved:string, horaActual:string)
  {
    let listaMensajes = document.getElementById("chat-messages");

    //Creo el mensaje como tal
    let nuevoMensaje = document.createElement("li");

    let nuevaInfo = document.createElement("p");
    nuevaInfo.innerHTML = usernameRecieved  + " - " + horaActual;

    //Creo el texto y le asigno el valor recibido
    let nuevoTexto = document.createElement("p");
    let mensajeTruncado = this.textoTruncado(mensajeRecieved);
    nuevoTexto.innerHTML = mensajeTruncado;

    nuevoMensaje.appendChild(nuevaInfo);
    nuevoMensaje.appendChild(nuevoTexto);
    nuevoMensaje.setAttribute("class","ownMessage");
    nuevoMensaje.className = 'ownMessage';

    console.log(nuevoMensaje);
    listaMensajes?.appendChild(nuevoMensaje);
  }

  private textoTruncado(texto:string):string
  {
    let stringTruncado = texto;

    if (texto.length > 25)
    {
      let texto1Sliced = texto.slice(undefined,25);
      console.log("SLICED 1:");
      console.log(texto1Sliced);

      let texto2Sliced = texto.slice(25);
      console.log("SLICED 2:");
      console.log(texto2Sliced);

      stringTruncado = texto1Sliced + "<br>" + texto2Sliced;
    }

    console.log("STRING TRUNCADO:");
    console.log(stringTruncado);
    return stringTruncado;
  }

}
