import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-rounting.module';
import { TituloEncabezadoModule } from '../../Header/titulo-encabezado/titulo-encabezado.module';
import {PermisosComponent} from './permisos/permisos.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QueryCompleteModule} from '../../../Components/query-complete/query-complete.module';
import {PermisoService} from '../../../Servicios/permiso/permiso.service';
import { ConfirmPasswordCurrentDirective } from '../../../Validations/confirmPasswordCurrent/confirm-password-current.directive';
import { ConfirmNewPasswordDirective } from '../../../Validations/confirmNewPassword/confirm-new-password.directive';
import {PerfilComponent} from './perfil/perfil.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    PermisosComponent,
    ConfirmPasswordCurrentDirective,
    ConfirmNewPasswordDirective,
    PerfilComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    CommonModule,
    UsuariosRoutingModule,
    TituloEncabezadoModule,
    FontAwesomeModule,
    QueryCompleteModule,
  ],
  providers: [
    PermisoService
  ]
})
export class UsuariosModule { }
