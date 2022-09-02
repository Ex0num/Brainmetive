import { Component } from '@angular/core';

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
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
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Brainmetive';
}
