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

  public obtNewId_account(idBackup):Observable<any> {
    return this.http.get(URL + 'obtNewId_account', {params: {idBack: idBackup}});
  }

  public agregarAccount(account): Observable<any> {
    const  parametro = new HttpParams()
      .append('account', JSON.stringify(account));
    return this.http.post(URL + 'agregarAccount', parametro);
  }
  public actualizarAccount(account): Observable<any> {
    const  parametro = new HttpParams()
      .append('account', JSON.stringify(account));
    return this.http.post(URL + 'actualizarAccount', parametro);
  }
  public eliminarAccount (id_backup, id_account): Observable<any> {
    return this.http.delete(URL + 'eliminarAccount', {params: {id_backup: id_backup, id_account: id_account}});
  }

  public buscarAccountsBackup(idBackup, pagina): Observable<any> {
    // this.Accounts = [];
    return this.http.get(URL + 'buscarAccountsBackup', {params: {idBack: idBackup, pagina: pagina}});
  }

  public buscarInconsistenciaDatos(data, pagina, backups): Observable<any> {
    // this.Accounts = [];
    return this.http.get(URL + 'buscarInconsistenciaDatosAccounts', {params: {dataUser: JSON.stringify(data), pagina: pagina, backups: backups}});
  }

}
