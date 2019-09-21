import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../Servicios/categories/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  public msj;

  constructor( private route: ActivatedRoute,
               private router: Router, private categoriesService: CategoriesService,  private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.msj = 'Buscando Categories relacionados con el id_backup';
      this.util.crearLoading().then(() => {
        this.categoriesService.buscarCategoriesBackup(params.get('idBack')).subscribe(result => {
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
      console.log('Valor de id Backup', params.get('idBack'));
    });
  }

  ngOnInit() {
  }

}
