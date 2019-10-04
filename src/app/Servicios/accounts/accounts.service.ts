import { Injectable } from '@angular/core';
import { Accounts } from '../../Modelos/accounts/accounts';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  public Accounts: Accounts[] = [];

  constructor(private http: HttpClient) { }

  public buscarAccountsBackup(idBackup, pagina): Observable<any> {
    // this.Accounts = [];
    return this.http.get(URL + 'buscarAccountsBackup', {params: {idBack: idBackup, pagina: pagina}});
  }

  public buscarInconsistenciaDatos(data, pagina, backups): Observable<any> {
    // this.Accounts = [];
    return this.http.get(URL + 'buscarInconsistenciaDatosAccounts', {params: {dataUser: JSON.stringify(data), pagina: pagina, backups: backups}});
  }

}
