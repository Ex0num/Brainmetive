import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Vistas/login/login.component';
import { HomeComponent } from './Vistas/home/home.component';
import { QuiensoyComponent } from './Vistas/quiensoy/quiensoy.component';
import { ErrorComponent } from './Vistas/error/error.component';
import { RegisterComponent } from './Vistas/register/register.component';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './Vistas/chat/chat.component';
import { SalajuegosComponent } from './Vistas/salajuegos/salajuegos.component';
import { AhorcadoComponent } from './Juegos/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './Juegos/mayor-o-menor/mayor-o-menor.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
