import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { DetalleUsuarioRoutingModule } from './detalle-usuario-routing.module';
import { DetalleUsuarioComponent } from '../detalle-usuario/detalle-usuario.component';
import { GastosComponent } from './gastos/gastos.component';
import { EntradasComponent } from './entradas/entradas.component';
import { GastosEntradasComponent } from './gastos-entradas/gastos-entradas.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [DetalleUsuarioComponent, GastosComponent, EntradasComponent, GastosEntradasComponent],
  imports: [ChartsModule,
    NgxSpinnerModule,
    CommonModule,
    DetalleUsuarioRoutingModule,
    FormsModule
  ]
})
export class DetalleUsuarioModule { }
