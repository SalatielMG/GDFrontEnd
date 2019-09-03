import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {ActivatedRoute, Router} from '@angular/router';
import {BackupService} from "../../../../Servicios/backup/backup.service";

@Component({
  selector: 'app-inconsistencia',
  templateUrl: './inconsistencia.component.html',
  styleUrls: ['./inconsistencia.component.css']
})
export class InconsistenciaComponent implements OnInit {

  private email: string = "";
  //  public usuarioMntSearch: FormGroup;

  constructor(private backupService: BackupService, private util: Utilerias,  private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    // this.construirFormulario();
  }
  /*public construirFormulario() {
    this.usuarioMntSearch = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }*/
  public search() {
    console.log("email user:", this.email);
    if (this.email.length == 0){
      this.util.emailUserMntInconsistencia = "Generales";
      this.compararRutaHija(this.router.url);
    } else {
      if ((this.util.regex_email).exec(this.email)) {
        this.util.emailUserMntInconsistencia = this.email;
        this.compararRutaHija(this.router.url);
      } else {
        this.util.msjToast("Porfavor ingrese un correo valido", "Email no Valido", true);
      }
    }
  }

  private compararRutaHija(ruta) {
    switch (ruta) {
      case "/mantenimiento/inconsistenciaMnt/accounts":
        this.navegacion("accounts");
        break;
      case "/mantenimiento/inconsistenciaMnt/automatics":
        this.navegacion("automatics");
        break;
      case "/mantenimiento/inconsistenciaMnt/budgets":
        this.navegacion("budgets");
        break;
      case "/mantenimiento/inconsistenciaMnt/cardviews":
        this.navegacion("cardviews");
        break;
      case "/mantenimiento/inconsistenciaMnt/categories":
        this.navegacion("categories");
        break;
      case "/mantenimiento/inconsistenciaMnt/currencies":
        this.navegacion("currencies");
        break;
      case "/mantenimiento/inconsistenciaMnt/extras":
        this.navegacion("extras");
        break;
      case "/mantenimiento/inconsistenciaMnt/movements":
        this.navegacion("movements");
        break;
      case "/mantenimiento/inconsistenciaMnt/preferences":
        this.navegacion("preferences");
        break;
    }
  }
  private navegacion(tabla){
    this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
      this.router.navigate([tabla], {relativeTo: this.route});
    });
  }
  private operacion(tabla){
    this.backupService.corregirInconsistencia(tabla).subscribe(result => {
      this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
        this.router.navigate([tabla], {relativeTo: this.route});
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public corregirTabla(){
    switch (this.router.url) {
      case "/mantenimiento/inconsistenciaMnt/accounts":
        this.operacion("accounts");
        break;
      case "/mantenimiento/inconsistenciaMnt/automatics":
        this.operacion("automatics");
        break;
      case "/mantenimiento/inconsistenciaMnt/budgets":
        this.operacion("budgets");
        break;
      case "/mantenimiento/inconsistenciaMnt/cardviews":
        this.operacion("cardviews");
        break;
      case "/mantenimiento/inconsistenciaMnt/categories":
        this.operacion("categories");
        break;
      case "/mantenimiento/inconsistenciaMnt/currencies":
        this.operacion("currencies");
        break;
      case "/mantenimiento/inconsistenciaMnt/extras":
        this.operacion("extras");
        break;
      case "/mantenimiento/inconsistenciaMnt/movements":
        this.operacion("movements");
        break;
      case "/mantenimiento/inconsistenciaMnt/preferences":
        this.operacion("preferences");
        break;
    }
  }

}
