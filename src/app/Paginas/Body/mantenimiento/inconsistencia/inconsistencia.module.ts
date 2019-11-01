import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InconsistenciaRoutingModule } from './inconsistencia-routing.module';
import { AccountsComponent } from './accounts/accounts.component';
import { AutomaticsComponent } from './automatics/automatics.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CardviewsComponent } from './cardviews/cardviews.component';
import { CategoriesComponent } from './categories/categories.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { ExtrasComponent } from './extras/extras.component';
import { MovementsComponent } from './movements/movements.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { InconsistenciaComponent } from './inconsistencia.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {LoadingSpinnerModule} from '../../../../Components/loading-spinner/loading-spinner/loading-spinner.module';
import {QueryCompleteModule} from '../../../../Components/query-complete/query-complete.module';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';


@NgModule({
  declarations: [InconsistenciaComponent, AccountsComponent, AutomaticsComponent, BudgetsComponent, CardviewsComponent, CategoriesComponent, CurrenciesComponent, ExtrasComponent, MovementsComponent, PreferencesComponent],
  imports: [ReactiveFormsModule, FormsModule,FontAwesomeModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    CommonModule,
    InconsistenciaRoutingModule,
    LoadingSpinnerModule,
    QueryCompleteModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class InconsistenciaModule { }
