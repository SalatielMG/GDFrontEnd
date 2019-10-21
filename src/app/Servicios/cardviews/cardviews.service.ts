import { Injectable } from '@angular/core';
import { Cardviews } from '../../Modelos/cardviews/cardviews';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FiltersSearchCardviews} from '../../Modelos/cardviews/filters-search-cardviews';


@Injectable({
  providedIn: 'root'
})
export class CardviewsService {

  public Cardviews: Cardviews[] = [];
  public cardviewsFilter: Cardviews[] = [];
  public pagina = 0;
  public id_backup = 0;
  public filtersSearch = new FiltersSearchCardviews();
  public indexCardviewSelected: number = 0;
  public indexCardviewFilterSelected: number = 0;
  public CadViewsGralBackup: Cardviews[] = [];

  constructor(private http: HttpClient) { }

  public resetVariables () {
    this.Cardviews = [];
    this.pagina = 0;
  }

  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  private obtCardViewsBackup() {
      this.obtCardViewsGralBackup().subscribe(result => {
        if (!result.error){
          this.CadViewsGralBackup = result.cardviews;
          console.log("new CadViewsGralBackup query := ", this.CadViewsGralBackup);
        }
      }, error => {
        console.log(error);
      });
  }
  public actionFilterEvent(event, value, isKeyUp = false) {
    if (value == "show_card" || value == "id_card") {
      if (this.filtersSearch[value].value == "-1") {
        if (value == "id_card") this.obtCardViewsBackup();
        this.filtersSearch[value].isFilter = false;
        this.filtersSearch[value].valueAnt = this.filtersSearch[value].value;
        this.proccessFilter();
        return;
      }
    } else {
      if (isKeyUp && event.key != "Enter") return;
      if (this.filtersSearch[value].value == "") return;
    }
    if (this.filtersSearch[value].value == this.filtersSearch[value].valueAnt) return;
    this.resetFilterisActive();
    this.filtersSearch[value].isFilter = true;
    this.filtersSearch[value].valueAnt = this.filtersSearch[value].value;
    this.proccessFilter();
  }
  public resetValuefiltroSearch(key) {
    this.filtersSearch[key].value =  "";
    this.filtersSearch[key].valueAnt =  "";
    this.filtersSearch[key].isFilter =  false;
    if (key == "show_card" || key == "id_card") {
      this.filtersSearch[key].value = "-1";
      if (key == "id_card") this.obtCardViewsBackup();
    }
    if (!this.isFilter()) {
      this.cardviewsFilter = [];
      return;
    }
    this.proccessFilter();
  }
  public resetFilterisActive() {
    if (!this.isFilter()) {
      this.cardviewsFilter = [];
      this.cardviewsFilter =  this.cardviewsFilter.concat(this.Cardviews);
    }
  }
  public proccessFilter() {
    let temp = [];
    this.Cardviews.forEach((cardview) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if (((k == "show_card" || k == "id_card") && this.filtersSearch[k].value != "-1")) {
            if (cardview[k].toString() != this.filtersSearch[k].value) {
              bnd = false;
              break;
            }
          } else {
            if (!cardview[k].toString().includes(this.filtersSearch[k].value)) {
              bnd = false;
              break;
            }
          }
        }
      }

      if (bnd) {
        temp.push(cardview);
      }

    });
    this.cardviewsFilter = [];
    this.cardviewsFilter = this.cardviewsFilter.concat(temp);
    temp = null;
  }
  public isFilter(): boolean {
    for (let key in this.filtersSearch)
      if (this.filtersSearch[key].isFilter) return true;
    return false
  }

  // -------------------------------------------------- Filter Seacrh --------------------------------------------------

  public obtCardViewsGralBackup(): Observable<any> {
    return this.http.get(URL + 'obtCardViewsGralBackup', {params: {id_backup: this.id_backup.toString()}});
  }
  public buscarCardviewsBackup(): Observable<any> {
    return this.http.get(URL + 'buscarCardviewsBackup', {params: {id_backup: this.id_backup.toString(), pagina: this.pagina.toString()}});
  }

  public inconsistenciaDatos(data, pagina, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosCardviews', {params: {dataUser: JSON.stringify(data), pagina: pagina, backups: backups}});
  }
  public agregarCardview(cardview): Observable<any> {
    const  parametro = new HttpParams()
      .append('cardview', JSON.stringify(cardview));
    return this.http.post(URL + "agregarCardview", parametro);
  }
  public actualizarCardview(cardview, indexUnique): Observable<any> {
    const  parametro = new HttpParams()
      .append('cardview', JSON.stringify(cardview))
      .append("indexUnique", JSON.stringify(indexUnique));
    return this.http.post(URL + "actualizarCardview", parametro);
  }
  public eliminarCardview(indexUnique): Observable<any> {
    return this.http.delete(URL + "eliminarCardview", {params: {indexUnique: JSON.stringify(indexUnique)}});
  }
}
