import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Vistas/login/login.component';
import { HomeComponent } from './Vistas/home/home.component';
import { QuiensoyComponent } from './Vistas/quiensoy/quiensoy.component';
import { ErrorComponent } from './Vistas/error/error.component';
import { RegisterComponent } from './Vistas/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './Vistas/chat/chat.component';
import { SalajuegosComponent } from './Vistas/salajuegos/salajuegos.component';
import { AhorcadoComponent } from './Juegos/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './Juegos/mayor-o-menor/mayor-o-menor.component';
import { PreguntadosComponent } from './Juegos/preguntados/preguntados.component';
import { SrvApiPreguntadosService } from './Servicios/srv-api-preguntados.service';
import { RelacionadosComponent } from './Juegos/relacionados/relacionados.component';
import { EncuestaComponent } from './Vistas/encuesta/encuesta.component';
import { RankingComponent } from './Vistas/ranking/ranking.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    QuiensoyComponent,
    RegisterComponent,
    ChatComponent,
    ErrorComponent,
    SalajuegosComponent,
    AhorcadoComponent,
    MayorOMenorComponent,
    PreguntadosComponent,
    RelacionadosComponent,
    EncuestaComponent,
    RankingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SrvApiPreguntadosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
