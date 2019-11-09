import { Component, OnInit } from '@angular/core';
import {CategoriesService} from '../../../../../Servicios/categories/categories.service';
import {Utilerias} from '../../../../../Utilerias/Util';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public pagina: number = 0;
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public categoriesService: CategoriesService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      this.resetearVariables();
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Categories";
        return;
      }
      this.buscarInconsistencia();
    });
  }

  ngOnInit() {
    this.util.ready();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscarInconsistencia();
  }
  public resetearVariables(){
    this.categoriesService.Categories = [];
    this.pagina = 0;
  }
  public buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.pagina == 0){
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Categories';
      this.util.crearLoading().then(() => {
        this.categoriesService.inconsistenciaDato(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.categoriesService.inconsistenciaDato(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msjLoading =  result.msj;
      this.util.msj =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.categoriesService.Categories = this.categoriesService.Categories.concat(result.categories);
    }
    this.util.loadingMain = false;
  }
}
