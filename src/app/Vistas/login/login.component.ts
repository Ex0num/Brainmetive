import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  mailIngresadoLogin:string = "";
  passwordIngresadoLogin:string = "";

  constructor(private router: Router, private route: ActivatedRoute) 
  {}

  ngOnInit(): void 
  {}

  public loginAuthFirebase()
  {
    const auth = getAuth();
    
    signInWithEmailAndPassword(auth, this.mailIngresadoLogin, this.passwordIngresadoLogin).then((userCredential) =>
     {

      alert("El inicio de sesión fue satisfactorio. Bienvenido/a.");
      // this.mostrarSatisfaccion("El inicio de sesión fue satisfactorio. Bienvenido/a.");

        // Signed in
        const userLoged = userCredential.user;
        //this.limpiarControles();
        this.router.navigate(["/home"],);
      })
      .catch((error) => 
      {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(errorMessage);
        //this.mostrarError(errorMessage);
      });
  }

  // private mostrarError(errorRecibido:string)
  // {
  //   let txtBoxError = document.getElementById("txtError");
  //   txtBoxError.textContent = errorRecibido;
  //   txtBoxError.removeAttribute("hidden");

  //   let txtBoxSatisfaccion = document.getElementById("txtSatisfaccion");
  //   txtBoxSatisfaccion.setAttribute("hidden","true");
  // }

  // private mostrarSatisfaccion(satisfaccionRecibida:string)
  // {
  //   let txtBoxSatisfaccion = document.getElementById("txtSatisfaccion");
  //   txtBoxSatisfaccion.textContent = satisfaccionRecibida;
  //   txtBoxSatisfaccion.removeAttribute("hidden");

  //   let txtBoxError = document.getElementById("txtError");
  //   txtBoxError.setAttribute("hidden","true");
  // }


}
