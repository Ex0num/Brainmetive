import { Component, createComponent, OnInit } from '@angular/core';
import { snapshotChanges } from '@angular/fire/compat/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, onValue, onChildAdded, query} from "firebase/database";
import { addDoc, collection, doc, getFirestore, onSnapshot, where } from 'firebase/firestore';
import { map } from 'rxjs';
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

  public async sendMessage()
  {
      //--------------- Guardo al log en la DB ---------------------
      let mensajeEnviado = new Mensaje(this.usuario, this.mensaje);
      // this.listaLogsDB.push(mensajeEnviado);
      //----------------------------------------------------------------

      // Add a new document with a generated id. (TENGO EN "DocRef" la referencia a ese usuario si me hiciese falta)
      const docRef = await addDoc(collection(this.db, "Mensajes"), 
      {
        usuario: mensajeEnviado.username,
        texto: mensajeEnviado.texto,
        hora: mensajeEnviado.horaActual,
        fecha: mensajeEnviado.fechaActual,
      });
      //-------------------------------------------------------------
  }

  public recieveChanges()
  {
      // let docRef = doc(this.db, "Mensajes");
      // onSnapshot(docRef, {includeMetadataChanges: true}, (doc) => 
      // {
      //   console.log("Current data: ", doc.data());
      // });


      // let col = collection(this.db, "Mensajes");
      // let unsubscribe = onSnapshot(col ,(querySnapshot) => 
      // {
      //   let mensajes = new Array();

      //   querySnapshot.forEach((doc) => 
      //   {
      //     mensajes.push(doc.data());
      //   });

      //   console.log("Current messages: ", mensajes.join(", "));
      // });

      const unsubscribe = onSnapshot(collection(this.db, "Mensajes"), () => 
      {
        // Respond to data
        console.log("CHANGES DETECTED");
        // ...
      });
      
      // Later ...

  }

  // public sendMessage() 
  // {
  //   if (this.mensaje != null && this.mensaje != undefined && this.mensaje != "" && this.mensaje.length < 50)
  //   {

  //     let horaActualCalculada = new Date();

  //     let horaString = horaActualCalculada.toLocaleTimeString();
  //     let fechaString = horaActualCalculada.toLocaleDateString();
  
  //     let fechaStringed = fechaString.replace("/","-");
  //     fechaStringed = fechaStringed.replace("/","-");
  
  //     // set(ref(this.realTimeDB, 'mensajes/bubble' + "-" + this.usuarioID + "-(" + horaString + ")-(" + fechaStringed + ")"), 
  //     // {
  //     //   username: this.usuario,
  //     //   texto: this.mensaje,
  //     //   horaActual: horaString,
  //     //   fechaActual: fechaString,
  //     // });

  //     // set(ref(this.realTimeDB, 'mensajes/bubble' + "-" + "(" + horaString + ")-(" + fechaStringed + ")"), 
  //     // {
  //     //   username: this.usuario,
  //     //   texto: this.mensaje,
  //     //   horaActual: horaString,
  //     //   fechaActual: fechaString,
  //     // });

  //     set(ref(this.realTimeDB, 'mensajes/bubble' + '-' + this.usuarioID), 
  //     {
  //       username: this.usuario,
  //       texto: this.mensaje,
  //       horaActual: horaString,
  //       fechaActual: fechaString,
  //     });

  //     console.log("");
  //     console.log("OWN MESSAGE SEND");
  //     this.createOwnNewBubble(this.mensaje, this.usuario, horaString);
  //     console.log("");

  //     // this.mensaje = "";
  //     this.flagOwnMessage = true;
  //   }
  // }

  // public recievedMessage()
  // {
  //   const messagesRef = ref(this.realTimeDB,"mensajes");

  //   onValue(messagesRef, (snapshot) => 
  //   {
  //     if (this.flagLoadingMessages == true)
  //     {
  //         console.log("LOADING MESSAGES");
  //         this.flagLoadingMessages = false;
  //     } 
  //     else
  //     {
  //       console.log("ON VALUE ACTIVATED");
  //       console.log(snapshot.exists());
        
  //       console.log(snapshot.val());
        
  //       snapshot.forEach(element => 
  //       {
  //         console.log(element.child("mensajes/"));  
  //       });
  //       // snapshotChanges().pipe(map(x => console.log(x)));
  //     }
  //   });
  // }

  // onChildAdded(messagesRef,(data) => 
  // {
  //   console.log("ON CHILD ADDED ACTIVATED");
  //   // console.log("");
  //   // console.log("OTHER MESSAGE RECIEVED");
  //   // this.createNewBubble(data.val().texto,data.val().username,data.val().horaActual);
  //   // console.log(data.val());
  // });

  // public updateMessages()
  // {
  //   const messagesRef = ref(this.realTimeDB,"mensajes");

  //   onValue(messagesRef, (snapshot) => 
  //   {
  //       if (this.flagLoadingMessages == false)
  //       { 
  //         if (this.flagOwnMessage == false)
  //         {
  //           console.log("");
  //           console.log("CREANDO MENSAJE AJENO BUBBLE");

  //           // this.createNewBubble(childData["texto"],childData["username"],childData["horaActual"]);
  //           //Tengo que buscar la forma de crear la bubble con la informacion que posee la data del cambio
            
  //           console.log("LENGHT");
  //           console.log(snapshot.size);
  //           // console.log(snapshot.val().length);
            
  //           onChildAdded(messagesRef,(data) => 
  //           {
  //             console.log("");
  //             console.log("CHILDREN ADDED");
  //             this.createNewBubble(data.val().texto,data.val().username,data.val().horaActual);
  //             console.log(data.val());
  //           });

  //           // for (let i = 0; i < snapshot.size; i++) 
  //           // {
  //           //   if (i - 1 == snapshot.size)
  //           //   { 
  //           //     const childData = snapshot.val();
  //           //     console.log(childData);
  //           //     this.createNewBubble(childData["texto"],childData["username"],childData["horaActual"]);
  //           //   }
  //           // }

  //           // snapshot.forEach((childSnapshot) => 
  //           // {
  //           //   const childData = childSnapshot.val();
  //           //   this.createNewBubble(childData["texto"],childData["username"],childData["horaActual"]);
  //           //   // ...
  //           // });
  //         }
  
  //         this.flagOwnMessage = false;
  //       }
  //       else
  //       {
  //         this.flagLoadingMessages = false;
  //       }        
  //   });
  // }

  // public 
  // onChildAdded(messagesRef,(data) => 
  // {
  //   console.log("");
  //   console.log("CHILDREN ADDED");
  //   // this.createNewBubble(data.val().texto,data.val().username,data.val().horaActual);
  //   console.log(data.val());
  // });

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
