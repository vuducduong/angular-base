import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LicenseComponent } from './license/license.component';

const routes: Routes = [
  {
    path : '',
    children: [
      {  path: 'login', component: LoginComponent },
      {  path: 'license', component: LicenseComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
