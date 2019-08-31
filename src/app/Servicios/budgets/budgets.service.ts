import { Injectable } from '@angular/core';
import { Budgets } from '../../Modelos/budgets/budgets';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BudgetsService {

  public Budgets: Budgets[];

  constructor(private http: HttpClient) { }

  public buscarBudgetsBackup(idBackup): Observable<any> {
    this.Budgets = [];
    return this.http.get(URL + 'buscarBudgetsBackup', {params:{idBack: idBackup}});
  }

  public inconsistenciaDatos(): Observable<any> {
    this.Budgets = [];
    return this.http.get(URL + 'buscarInconsistenciaDatosBudgets');
  }

}
