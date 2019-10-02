import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupComponent } from './backup.component';
import { BackupRoutingModule } from './backup-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {QueryCompleteModule} from "../../../Components/query-complete/query-complete.module";
import {FormsModule} from "@angular/forms";
import {LoadingSpinnerModule} from "../../../Components/loading-spinner/loading-spinner/loading-spinner.module";

/*Componentes*/
import { AccountsComponent } from './accounts/accounts.component';
import { AutomaticsComponent } from './automatics/automatics.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CardviewsComponent } from './cardviews/cardviews.component';
import { CategoriesComponent } from './categories/categories.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { ExtrasComponent } from './extras/extras.component';
import { MovementsComponent } from './movements/movements.component';
import { PreferencesComponent } from './preferences/preferences.component';

/*Servicios*/
import { AccountsService } from '../../../Servicios/accounts/accounts.service';
import { AutomaticsService } from '../../../Servicios/automatics/automatics.service';
import { BudgetsService } from '../../../Servicios/budgets/budgets.service';
import { CardviewsService } from '../../../Servicios/cardviews/cardviews.service';
import { CategoriesService } from '../../../Servicios/categories/categories.service';
import { CurrenciesService } from '../../../Servicios/currencies/currencies.service';
import { ExtrasService } from '../../../Servicios/extras/extras.service';
import { MovementsService } from '../../../Servicios/movements/movements.service';
import { PreferencesService } from '../../../Servicios/preferences/preferences.service';


@NgModule({
  declarations: [BackupComponent, AccountsComponent, AutomaticsComponent, BudgetsComponent, CardviewsComponent, CategoriesComponent, CurrenciesComponent, ExtrasComponent, MovementsComponent, PreferencesComponent],
  imports: [
    QueryCompleteModule,
    FormsModule,
    LoadingSpinnerModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    CommonModule,
    BackupRoutingModule
  ],
  providers: [
    AccountsService,
    AutomaticsService,
    BudgetsService,
    CardviewsService,
    CategoriesService,
    CurrenciesService,
    ExtrasService,
    MovementsService,
    PreferencesService
  ]
})
export class BackupModule { }
