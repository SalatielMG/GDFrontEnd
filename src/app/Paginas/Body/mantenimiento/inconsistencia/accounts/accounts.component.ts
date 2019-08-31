import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AccountsService} from "../../../../../Servicios/accounts/accounts.service";
import {Utilerias} from "../../../../../Utilerias/Util";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public msj;

  constructor(private accountService: AccountsService, private util: Utilerias) {
    this.msj = 'Buscando inconsistencia de datos en la tabla Accounts';
    this.util.crearLoading().then(() => {
      this.accountService.buscarInconsistenciaDatos().subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.accountService.Accounts = result.accounts;
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
