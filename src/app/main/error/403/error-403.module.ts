import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { Error403Component } from './error-403.component';
import { CardModule } from 'primeng/card';

const routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: '', component: Error403Component }
    ]
  }
];

@NgModule({
  declarations: [
    Error403Component
  ],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class Error403Module {
}
