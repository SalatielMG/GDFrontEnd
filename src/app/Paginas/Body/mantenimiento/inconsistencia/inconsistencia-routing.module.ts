import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InconsistenciaComponent } from './inconsistencia.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AutomaticsComponent } from './automatics/automatics.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CardviewsComponent } from './cardviews/cardviews.component';
import { CategoriesComponent } from './categories/categories.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { ExtrasComponent } from './extras/extras.component';
import { MovementsComponent } from './movements/movements.component';
import { PreferencesComponent } from './preferences/preferences.component';


const routes: Routes = [
  {path: '', component: InconsistenciaComponent, children: [
      {path: 'accounts/:backups', component: AccountsComponent, },
      {path: 'automatics/:backups', component: AutomaticsComponent},
      {path: 'budgets/:backups', component: BudgetsComponent},
      {path: 'cardviews/:backups', component: CardviewsComponent},
      {path: 'categories/:backups', component: CategoriesComponent},
      {path: 'currencies/:backups', component: CurrenciesComponent},
      {path: 'extras/:backups', component: ExtrasComponent},
      {path: 'movements/:backups', component: MovementsComponent},
      {path: 'preferences/:backups', component: PreferencesComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InconsistenciaRoutingModule { }
