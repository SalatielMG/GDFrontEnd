import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-rounting.module';
import { TituloEncabezadoModule } from '../../Header/titulo-encabezado/titulo-encabezado.module';
import {PermisosComponent} from './permisos/permisos.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    UsuariosComponent,
    PermisosComponent,
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    TituloEncabezadoModule,
    FontAwesomeModule
  ]
})
export class UsuariosModule { }
