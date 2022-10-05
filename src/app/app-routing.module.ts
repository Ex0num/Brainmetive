import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from './Juegos/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './Juegos/mayor-o-menor/mayor-o-menor.component';
import { PreguntadosComponent } from './Juegos/preguntados/preguntados.component';
import { RelacionadosComponent } from './Juegos/relacionados/relacionados.component';
import { ChatComponent } from './Vistas/chat/chat.component';
import { EncuestaComponent } from './Vistas/encuesta/encuesta.component';
import { ErrorComponent } from './Vistas/error/error.component';
import { HomeComponent } from './Vistas/home/home.component';
import { LoginComponent } from './Vistas/login/login.component';
import { QuiensoyComponent } from './Vistas/quiensoy/quiensoy.component';
import { RankingComponent } from './Vistas/ranking/ranking.component';
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
  {path: 'juegos/preguntados',component:PreguntadosComponent},
  {path: 'juegos/relacionados',component:RelacionadosComponent},
  {path: 'encuesta',component:EncuestaComponent},
  {path: 'ranking',component:RankingComponent},
  {path: '', component:HomeComponent},
  {path: '**',component:ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
