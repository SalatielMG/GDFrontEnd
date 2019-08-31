import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackupComponent } from './backup.component';
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
  { path: "", component: BackupComponent,
    children: [
      {path:'accounts', component: AccountsComponent, },
      {path:'automatics', component: AutomaticsComponent},
      {path:'budgets', component: BudgetsComponent},
      {path:'cardviews', component: CardviewsComponent},
      {path:'categories', component: CategoriesComponent},
      {path:'currencies', component: CurrenciesComponent},
      {path:'extras', component: ExtrasComponent},
      {path:'movements', component: MovementsComponent},
      {path:'preferences', component: PreferencesComponent},
    ], }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackupRoutingModule { }
