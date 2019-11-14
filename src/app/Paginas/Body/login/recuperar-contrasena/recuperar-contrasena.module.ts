import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecuperarContrasenaRoutingModule } from './recuperar-contrasena-routing.module';
import {RecuperarContrasenaComponent} from './recuperar-contrasena.component';
import {TituloEncabezadoModule} from '../../../Header/titulo-encabezado/titulo-encabezado.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgxSpinnerModule} from 'ngx-spinner';
import {VerifyExixtsEmailAndSendCodeDirective} from '../../../../Validations/verifyExitsEmailAndSendCode/verify-exixts-email-and-send-code.directive';
import {VerifyCodeResetPasswordDirective} from '../../../../Validations/verifyCodeResetPassword/verify-code-reset-password.directive';


@NgModule({
  declarations: [
    VerifyExixtsEmailAndSendCodeDirective,
    RecuperarContrasenaComponent,
    VerifyCodeResetPasswordDirective,
  ],
  imports: [
    CommonModule,
    TituloEncabezadoModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    RecuperarContrasenaRoutingModule
  ]
})
export class RecuperarContrasenaModule { }
