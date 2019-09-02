import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-inconsistencia',
  templateUrl: './inconsistencia.component.html',
  styleUrls: ['./inconsistencia.component.css']
})
export class InconsistenciaComponent implements OnInit {

  private email: string = "";
  //  public usuarioMntSearch: FormGroup;

  constructor(private util: Utilerias,  private route: ActivatedRoute,
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
        this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
          this.router.navigate(["accounts"], {relativeTo: this.route});
        });
        break;
      case "/mantenimiento/inconsistenciaMnt/automatics":
        this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
          this.router.navigate(["automatics"], {relativeTo: this.route});
        });
        break;
      case "/mantenimiento/inconsistenciaMnt/budgets":
        this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
          this.router.navigate(["budgets"], {relativeTo: this.route});
        });
        break;
      case "/mantenimiento/inconsistenciaMnt/cardviews":
        this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
          this.router.navigate(["cardviews"], {relativeTo: this.route});
        });
        break;
      case "/mantenimiento/inconsistenciaMnt/categories":
        this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
          this.router.navigate(["categories"], {relativeTo: this.route});
        });
        break;
      case "/mantenimiento/inconsistenciaMnt/currencies":
        this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
          this.router.navigate(["currencies"], {relativeTo: this.route});
        });
        break;
      case "/mantenimiento/inconsistenciaMnt/extras":
        this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
          this.router.navigate(["extras"], {relativeTo: this.route});
        });
        break;
      case "/mantenimiento/inconsistenciaMnt/movements":
        this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
          this.router.navigate(["movements"], {relativeTo: this.route});
        });
        break;
      case "/mantenimiento/inconsistenciaMnt/preferences":
        this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
          this.router.navigate(["preferences"], {relativeTo: this.route});
        });
        break;
    }
  }

}
