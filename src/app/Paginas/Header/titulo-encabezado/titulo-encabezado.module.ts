import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TituloEncabezadoComponent } from './titulo-encabezado.component';


@NgModule({
  declarations: [TituloEncabezadoComponent],
  imports: [
    CommonModule
  ],
  exports:[TituloEncabezadoComponent]
})
export class TituloEncabezadoModule { }
