import { NgIf } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_xYEsfGOpV2DAzjl5P-Bzdcl9ISPbkqk",
  authDomain: "tp-labo-iv.firebaseapp.com",
  projectId: "tp-labo-iv",
  storageBucket: "tp-labo-iv.appspot.com",
  messagingSenderId: "1005341932224",
  appId: "1:1005341932224:web:99d7755337c19e67078b25",
  measurementId: "G-0BGDLY9F1S"
};

// // Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{
  title = 'Brainmetive';
  mailShowed:any = "UserExample@gmail.com";

  constructor(private router: Router, private route: ActivatedRoute)
  {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => 
    {
      if (user) 
      {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;

        //Si el usuario esta logeado
        //..

        this.mailShowed = user.email;
        let btnLogin = document.getElementById("btnLogin");
        let btnRegister = document.getElementById("btnSignUp");

        btnLogin?.setAttribute("hidden","true");
        btnRegister?.setAttribute("hidden","true");

        let btnLogOut = document.getElementById("btnLogout");
        btnLogOut?.removeAttribute("hidden");

        console.log("LOGEADO!!!");

        let mailShower = document.getElementById("userMail-loged");
        mailShower?.removeAttribute("hidden");

        // ...
      } else 
      {
        // User is signed out
        // ...
        //Si el usuario no esta logeado
        //..
        let btnLogin = document.getElementById("btnLogin");
        let btnRegister = document.getElementById("btnSignUp");

        btnLogin?.removeAttribute("hidden");
        btnRegister?.removeAttribute("hidden");

        let btnLogOut = document.getElementById("btnLogout");
        btnLogOut?.setAttribute("hidden","true");

        let mailShower = document.getElementById("userMail-loged");
        mailShower?.setAttribute("hidden","true");

        console.log("DESLOGEADO!!");
      }
    });

  }

  logOut()
  {
    const auth = getAuth();
    signOut(auth).then(() => 
    {
      // Sign-out successful.
      alert("Cierre de sesión satisfactorio. Vuelva prontosss!");
      this.router.navigate(['/login']);

    }).catch((error) => 
    {
      // An error happened.
      alert(error);
    });
  }

  navigateLogin()
  {
    this.router.navigate(["/login"],);
  }

  navigateRegister()
  {
    this.router.navigate(["/register"],);
  }

}
