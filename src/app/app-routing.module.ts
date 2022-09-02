import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './Vistas/error/error.component';
import { HomeComponent } from './Vistas/home/home.component';
import { LoginComponent } from './Vistas/login/login.component';
import { QuiensoyComponent } from './Vistas/quiensoy/quiensoy.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'quiensoy',component:QuiensoyComponent},
  {path:'login',component:LoginComponent},
  {path: '', component:HomeComponent},
  {path: '**',component:ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
