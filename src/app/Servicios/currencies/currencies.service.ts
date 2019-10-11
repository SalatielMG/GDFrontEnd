import { Injectable } from '@angular/core';
import { Currencies } from '../../Modelos/currencies/currencies';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  public pagina: number = 0;
  public Currencies: Currencies[] = [];

  constructor(private http: HttpClient) { }

  public buscarCurrenciesBackup(id_backup): Observable<any> {
    // this.Currencies = [];
    return this.http.get(URL + 'buscarCurrenciesBackup', {params:{id_backup: id_backup, pagina: this.pagina.toString(), isCurrenciesAccount: "0"}});
  }
  public inconsistenciaDatos(data, pagina, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosCurrencies', {params: {dataUser: JSON.stringify(data), pagina: pagina, backups: backups}});
  }

}
