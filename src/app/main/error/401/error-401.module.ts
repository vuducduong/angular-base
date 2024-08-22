import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { Error401Component } from './error-401.component';

const routes = [
    {
        path     : '',
        component: NavbarComponent,
        children: [
            {  path: '', component: Error401Component}
        ]
    }
];

@NgModule({
    declarations: [
        Error401Component
    ],
    imports     : [
        RouterModule.forChild(routes),
    ]
})
export class Error401Module
{
}
