import { Injectable } from '@angular/core';
import { Currencies } from '../../Modelos/currencies/currencies';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  public Currencies: Currencies[];

  constructor(private http: HttpClient) { }

  public buscarCurrenciesBackup(idBackup): Observable<any> {
    this.Currencies = [];
    return this.http.get(URL + 'buscarCurrenciesBackup', {params:{idBack: idBackup}});
  }
  public inconsistenciaDatos(email, pagina): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosCurrencies', {params: {email: email, pagina: pagina}});
  }

}
