import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from './Juegos/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './Juegos/mayor-o-menor/mayor-o-menor.component';
import { ChatComponent } from './Vistas/chat/chat.component';
import { ErrorComponent } from './Vistas/error/error.component';
import { HomeComponent } from './Vistas/home/home.component';
import { LoginComponent } from './Vistas/login/login.component';
import { QuiensoyComponent } from './Vistas/quiensoy/quiensoy.component';
import { RegisterComponent } from './Vistas/register/register.component';
import { SalajuegosComponent } from './Vistas/salajuegos/salajuegos.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'quiensoy',component:QuiensoyComponent},
  {path:'login',component:LoginComponent},
  {path: 'register',component:RegisterComponent},
  {path: 'chat',component:ChatComponent},
  {path: 'salajuegos',component:SalajuegosComponent},
  {path: 'juegos/ahorcado',component:AhorcadoComponent},
  {path: 'juegos/mayoromenor',component:MayorOMenorComponent},
  {path: '', component:HomeComponent},
  {path: '**',component:ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
