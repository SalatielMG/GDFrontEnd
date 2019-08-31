import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportacionComponent } from './exportacion.component';
import { ExportacionRoutingModule } from './exportacion-routing.module';

@NgModule({
  declarations: [ExportacionComponent],
  imports: [
    CommonModule,
    ExportacionRoutingModule
  ]
})
export class ExportacionModule { }
