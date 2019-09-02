import { Component, OnInit } from '@angular/core';
import {CategoriesService} from '../../../../../Servicios/categories/categories.service';
import {Utilerias} from '../../../../../Utilerias/Util';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public msj;

  constructor(private categoriesService: CategoriesService, private util: Utilerias) {
    this.msj = 'Buscando inconsistencia de datos en la tabla Categories';
    this.util.crearLoading().then(() => {
      this.categoriesService.inconsistenciaDato(this.util.emailUserMntInconsistencia).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.categoriesService.Categories = result.categories;
        }
      }, error => {
        this.util.detenerLoading();
        this.util.msjErrorInterno(error);
      });
    });
  }

  ngOnInit() {
  }

}
