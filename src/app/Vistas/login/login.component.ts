import { Component, Input, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { app, AppComponent } from 'src/app/app.component';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { Log } from 'src/app/Entidades/log';

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const Logs = collection(db, "Logs");

const now = new Date();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  mailIngresadoLogin:string = "";
  passwordIngresadoLogin:string = "";

  errorShowed:any = "Algo salio mal";

  log:Log = new Log();
  listaLogsDB: Log[] = [];

  constructor(private router: Router, private route: ActivatedRoute) 
  {
    this.log.mail = "aux@gmail.com";
    this.log.fecha = now.toString();

    this.leerDB(); 

    //Elimino el usuario auxiliar. Lo precisaba solo para instanciar la lista de users.
    this.listaLogsDB.reverse();
    this.listaLogsDB.pop();

    console.log("LISTA DE LA DB VACIA, LIMPIA. READY TO USE.");
    console.log(this.listaLogsDB);
  }

  public loginAuthFirebase()
  {
    const auth = getAuth();
    
    signInWithEmailAndPassword(auth, this.mailIngresadoLogin, this.passwordIngresadoLogin).then(async (userCredential) =>
     {

      console.log("El inicio de sesión fue satisfactorio. Bienvenido/a.");
      // this.mostrarSatisfaccion("El inicio de sesión fue satisfactorio. Bienvenido/a.");

        // Signed in
        const userLoged = userCredential.user;

        //--------------- Guardo al log en la DB ---------------------
        let logRegistrado = new Log();
        logRegistrado.mail = this.mailIngresadoLogin;
        logRegistrado.fecha = now.toString();

        this.listaLogsDB.push(logRegistrado);
        //----------------------------------------------------------------

        // Add a new document with a generated id. (TENGO EN "DocRef" la referencia a ese usuario si me hiciese falta)
        const docRef = await addDoc(collection(db, "Logs"), 
        {
          mail: logRegistrado.mail,
          fechaLog: logRegistrado.fecha
        });
        //-------------------------------------------------------------

        //this.limpiarControles();
        this.router.navigate(["/home"],);
      })
      .catch((error) => 
      {
          const errorCode = error.code;
          const errorMessage = error.message;

          this.mostrarError("MSG: " + errorMessage + " CODE: " + errorCode);
            
          switch (errorCode) 
          {
            case "auth/invalid-email":
            {
              this.mostrarError("El mail ingresado es invalido.");
              break;
            }
            case "auth/internal-error":
            {
              this.mostrarError("Hubo un error interno de procesamiento.");
              break;
            }
            case "auth/wrong-password":
            {
              this.mostrarError("La contraseña ingresada es incorrecta.");
              break;
            }
            case "auth/user-not-found":
            {
              this.mostrarError("No se pudo encontrar al usuario.");
              break;
            }
            case "auth/network-request-failed":
            {
              this.mostrarError("Hubo un problema de conexión. Chequea tu red.");
              break;
            }
            default:
            {
              this.mostrarError("Ocurrió un error inesperado. Por favor comunicate con el soporte.");
              break;
            }
          }
      });
  }

  private mostrarError(errorRecibido:string)
  {
    let lblerrorMessage = document.getElementById("txtError");
    lblerrorMessage?.removeAttribute("hidden");

    this.errorShowed = errorRecibido;
  }

  async leerDB() 
  {
    console.log("-------------------------------------");
    console.log("USUARIOS LEIDOS DE LA DB:")

    //Obtengo los documentos de forma asincronica, con un await. Por cada documento creo un usuario le asigno los datos y lo guardo
    const querySnapshot = await getDocs(collection(db, "Logs"));
    querySnapshot.forEach((doc) => 
    {
        // imprimo la data
        console.log(doc.id, " => ", doc.data());

        //creo el log y le agrego la data
        let log = new Log();
        log.mail = doc.data()['mail'];
        log.fecha = doc.data()['fechaLog'];

        console.log("EL LOG QUE VOY A PUSHEAR:");
        console.log(log);

        this.listaLogsDB.push(log);
    });
  }
}
