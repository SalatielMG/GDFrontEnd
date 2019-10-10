import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL} from '../../Utilerias/URL';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountscategoriesService {

  constructor(private http: HttpClient) { }

  public obtCategoriesAccountBackup(id_backup, id_account): Observable<any> {
    return this.http.get(URL + "obtCategoriesAccountBackup", {params: {id_backup: id_backup, id_account: id_account}});
  }
  public obtAccountsBackup(id_backup): Observable<any> {
    return this.http.get(URL + "obtAccountsBackup", {params: {id_backup: id_backup}});
  }
}
