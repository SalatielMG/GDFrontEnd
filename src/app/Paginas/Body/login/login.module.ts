import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import {LoginComponent} from './login.component';
import {TituloEncabezadoModule} from '../../Header/titulo-encabezado/titulo-encabezado.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgxSpinnerModule} from 'ngx-spinner';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    TituloEncabezadoModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    NgxSpinnerModule
  ]
})
export class LoginModule { }
