import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit 
{

  mailIngresadoRegister:string = "";
  passwordIngresadoRegister:string = "";

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  async registerAuthFirebase()
  {
      const auth = getAuth();
      
      createUserWithEmailAndPassword(auth, this.mailIngresadoRegister, this.passwordIngresadoRegister).then(async (userCredential) => 
      {
          alert("Su usuario acaba de ser registrado satisfactoriamente.");
          //this.mostrarSatisfaccion("Su usuario acaba de ser registrado satisfactoriamente."); 
          //this.limpiarControles();
           
          // Signed in
          const userRegistered = userCredential.user;
          
          this.router.navigate(['/home']);
        })
        .catch((error) => 
        {
          const errorCode = error.code;
          const errorMessage = error.message;

          alert(errorMessage);
          //this.mostrarError(errorMessage);
        });
  }

}
