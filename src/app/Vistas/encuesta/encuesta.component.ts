import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDoc, collection, getFirestore, setDoc } from 'firebase/firestore';
import { app } from 'src/app/app.component';

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const Encuestas = collection(db, "Encuestas");

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {

  constructor(private formBuilder:FormBuilder) { }
  ngOnInit(): void {

    this.forma = this.formBuilder.group({
      'nombre' : ['', [Validators.required]],
      'apellido' : ['', [Validators.required]],
      'numero' : ['', [Validators.required], this.esLargoValido],
      'edad' : ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      'rol' : ['', [Validators.required]],
      'comentario' : ['', [Validators.required]],
    })
  }

  forma:FormGroup | any;
  
  public async enviarEncuesta():Promise<void>
  {
    let object = this.forma?.getRawValue();
    console.log(object);

    if (object["nombre"] != "" && 
    object["apellido"] != "" &&
    object["numero"] != "" && 
    object["edad"] != "" && 
    object["rol"] != "" &&
    object["comentario"] != "" && 
    object["comentario"].lenght < 80)
    {
        // Add a new document with a generated id. (TENGO EN "DocRef" la referencia a ese usuario si me hiciese falta)
        const docRef = await addDoc(collection(db, "Encuestas"), 
        {
          nombre:object["nombre"],
          apellido:object["apellido"],
          numero:object["numero"],
          edad:object["edad"],
          rol:object["rol"],
          comentario:object["comentario"],
        });

        console.log("Encuesta guardada");
    }
    else
    {
      let mensajeErrorFinal = document.getElementById("error-enviando");
      mensajeErrorFinal?.removeAttribute("hidden");

      setTimeout( () => 
      {
        mensajeErrorFinal?.setAttribute("hidden","true");
      },2000)

    } 
  }

  private async esLargoValido(control:AbstractControl): Promise<object | null>
  {
    const numero = <number>control.value

    if (numero.toString().length > 10)
    {
      return {esLargoValido: false};
    }
    else
    {
      return null;
    }
  }

}
