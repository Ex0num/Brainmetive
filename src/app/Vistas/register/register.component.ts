import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { Usuario } from 'src/app/Entidades/usuario';
import { collection, doc, setDoc, getDocs, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from 'src/app/app.component';

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const Usuarios = collection(db, "Usuarios");

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit 
{

  mailIngresadoRegister:string = "";
  passwordIngresadoRegister:string = "";
  passwordIngresadoConfirmRegister:string = "";

  errorShowed:any = "Algo salio mal";

  user:Usuario = new Usuario();
  listaUsuariosDB: Usuario[] = [];

  constructor(private router: Router, private route: ActivatedRoute) 
  {
    this.user.mail = "aux";
    this.user.password = "aux";

    this.leerDB(); 

    //Elimino el usuario auxiliar. Lo precisaba solo para instanciar la lista de users.
    this.listaUsuariosDB.reverse();
    this.listaUsuariosDB.pop();

    console.log("LISTA DE LA DB VACIA, LIMPIA. READY TO USE.");
    console.log(this.listaUsuariosDB);
  }

  ngOnInit(): void {}

  async registerAuthFirebase()
  {
      if (this.passwordIngresadoRegister == this.passwordIngresadoConfirmRegister)
      {
          const auth = getAuth();
          let errorCode = "0";

          createUserWithEmailAndPassword(auth, this.mailIngresadoRegister, this.passwordIngresadoRegister).then(async (userCredential) => 
        {
            // Signed in
            const userRegistered = userCredential.user;

            //--------------- Guardo al mail en la DB ---------------------
            let usuarioRegistrado = new Usuario();
            usuarioRegistrado.mail = this.mailIngresadoRegister;
            usuarioRegistrado.password = this.passwordIngresadoRegister;

            this.listaUsuariosDB.push(usuarioRegistrado);
            //----------------------------------------------------------------

            // Add a new document with a generated id. (TENGO EN "DocRef" la referencia a ese usuario si me hiciese falta)
            const docRef = await addDoc(collection(db, "Usuarios"), 
            {
              mail: usuarioRegistrado.mail,
              password: usuarioRegistrado.password
            });
            //-------------------------------------------------------------
  
  
            this.router.navigate(['/home']);
          })
          .catch((error) => 
          {
            errorCode = error.code;
            const errorMessage = error.message;
  
            // this.mostrarError("MSG: " + errorMessage + " CODE: " + errorCode);
          
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
              case "auth/weak-password":
              {
                this.mostrarError("La contraseña ingresada es debil. Minimo 6 caracteres.");
                break;
              }
              case "auth/missing-email":
              {
                this.mostrarError("No se ha detectado un mail.");
                break;
              }
              case "auth/email-already-in-use":
              {
                this.mostrarError("Ya existe una cuenta con el mail ingresado.");
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
      else
      {
          this.mostrarError("Las contraseñas no coinciden.");
      }
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
    const querySnapshot = await getDocs(collection(db, "Usuarios"));
    querySnapshot.forEach((doc) => 
    {
        // imprimo la data
        console.log(doc.id, " => ", doc.data());

        //creo el usuario y le agrego la data
        let user = new Usuario();
        user.mail = doc.data()['mail'];
        user.password = doc.data()['password'];

        console.log("EL USUARIO QUE VOY A PUSHEAR:");
        console.log(user);

        this.listaUsuariosDB.push(user);
    });

    console.log("-------------------------------------");
    console.log("LA LISTA FINAL QUEDO DE LA SIGUIENTE MANERA:");
    console.log(this.listaUsuariosDB);
  }
}
