import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL} from '../../Utilerias/URL';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountscategoriesService {

  constructor(private http: HttpClient) { }

  public obtCategoriesAccountBackup(id_backup, id_account, signCategories = "both"): Observable<any> {
    return this.http.get(URL + "obtCategoriesAccountBackup", {params: {id_backup: id_backup, id_account: id_account, signCategories: signCategories}});
  }
  public obtAccountsBackup(id_backup, categoriesSearch = "1", signCategories = "both"): Observable<any> {
    return this.http.get(URL + "obtAccountsBackup", {params: {id_backup: id_backup, categoriesSearch: categoriesSearch, signCategories: signCategories}});
  }
}
