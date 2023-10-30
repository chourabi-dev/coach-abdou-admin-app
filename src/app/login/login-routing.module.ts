import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LoginformComponent } from './loginform/loginform.component';
import { SignupformComponent } from './signupform/signupform.component';

const routes: Routes = [
  {
    path: '',
    component: LoginformComponent,    
  },
  {
    path: 'login',
    component: LoginformComponent,
  },
  {
    path:'s',
    component: SignupformComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
