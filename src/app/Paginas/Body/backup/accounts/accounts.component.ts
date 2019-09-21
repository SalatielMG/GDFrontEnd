import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../../../Servicios/accounts/accounts.service';
import { Utilerias } from '../../../../Utilerias/Util';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  public msj;
  constructor( private route: ActivatedRoute,
               private router: Router, private accountService: AccountsService, private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.msj = 'Buscando Accounts relacionados con el id_backup';
      this.util.crearLoading().then(() => {
        this.accountService.buscarAccountsBackup(params.get('idBack')).subscribe(
          result => {
            this.util.detenerLoading();
            this.util.msjToast(result.msj, result.titulo, result.error);
            if (!result.error) {
              this.accountService.Accounts = result.accounts;
            }
          },
            error => {
              this.util.detenerLoading();
              this.util.msjErrorInterno(error);
            }
        );
      });
      console.log('Valor de id Backup', params.get('idBack'));
      // this.idBack = params.get('idBack');
    });

  }

  ngOnInit() {
  }

}
