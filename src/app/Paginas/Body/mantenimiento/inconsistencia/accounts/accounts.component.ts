import { Component, OnInit } from '@angular/core';
import {AccountsService} from "../../../../../Servicios/accounts/accounts.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import { faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  private pagina: number = 0;
  private faArrowUp = faArrowUp;
  private backup = [];

  constructor(private route: ActivatedRoute,
              private router: Router, private accountService: AccountsService, private util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backup = JSON.parse(params.get("backups"));
      console.log(this.backup);
      console.log("params", params);
      this.resetearVariables();
      this.buscarInconsistencia();
    });

  }

  ngOnInit() {
    console.log("ngOnInit()");
    this.util.ready();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscarInconsistencia();
  }

  private resetearVariables() {

    this.accountService.Accounts = [];
    this.pagina = 0;
  }

  private buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Accounts';
      this.util.crearLoading().then(() => {
        this.accountService.buscarInconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.accountService.buscarInconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }

  }

  private resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msjLoading =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.accountService.Accounts = this.accountService.Accounts.concat(result.accounts);

    }
    this.util.loadingMain = false;

  }


}
