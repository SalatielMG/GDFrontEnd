import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DetalleUsuarioComponent} from './detalle-usuario.component';
import {GastosComponent} from './gastos/gastos.component';
import {EntradasComponent} from './entradas/entradas.component';
import {GastosEntradasComponent} from './gastos-entradas/gastos-entradas.component';


const routes: Routes = [
  {path: '', component: DetalleUsuarioComponent,
    children: [
      {path: 'gastos', component: GastosComponent},
      {path: 'entradas', component: EntradasComponent},
      {path: 'gastosvsEntradas', component: GastosEntradasComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalleUsuarioRoutingModule { }
