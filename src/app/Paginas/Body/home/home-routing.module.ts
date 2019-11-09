import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'backups', loadChildren: () => import('../backups/backups.module').then(m => m.BackupsModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
