import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QueryCompleteComponent} from "./query-complete.component";



@NgModule({
  declarations: [QueryCompleteComponent],
  imports: [
    CommonModule
  ],
  exports: [
    QueryCompleteComponent
  ]
})
export class QueryCompleteModule { }
