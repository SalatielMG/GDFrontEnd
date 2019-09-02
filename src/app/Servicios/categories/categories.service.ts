import { Injectable } from '@angular/core';
import { Categories } from '../../Modelos/categories/categories';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  public Categories: Categories[];

  constructor(private http: HttpClient) { }

  public buscarCategoriesBackup(idBackup): Observable<any> {
    this.Categories = [];
    return this.http.get(URL + 'buscarCategoriesBackup', {params:{idBack: idBackup}});
  }

  public inconsistenciaDato(email): Observable<any> {
    this.Categories = [];
    return this.http.get(URL + 'buscarInconsistenciaDatosCategories', {params: {email: email}});
  }

}
