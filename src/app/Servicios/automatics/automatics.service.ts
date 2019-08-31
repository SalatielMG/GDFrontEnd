import { Injectable } from '@angular/core';
import { Automatics } from '../../Modelos/automatics/automatics';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutomaticsService {

  public Automatics: Automatics[];

  constructor(private http: HttpClient) { }

  public buscarAutomaticsBackup(idBackup): Observable<any> {
    this.Automatics = [];
    return this.http.get(URL + 'buscarAutomaticsBackup', {params:{idBack: idBackup}});
  }

}
