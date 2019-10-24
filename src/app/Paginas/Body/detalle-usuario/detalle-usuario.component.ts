import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../Servicios/user/user.service';
import { BackupService } from '../../../Servicios/backup/backup.service';
import { Chart } from 'chart.js';
import { Utilerias } from '../../../Utilerias/Util';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent implements OnInit {
  public msj;
  public PieChart=[];
  public etiquetas = [];
  public valores = [];
  constructor(private route: ActivatedRoute,
              private router: Router, private userService: UserService, private backService: BackupService, private util: Utilerias) {
    this.router.navigate(['gastos'], {relativeTo: this.route});
  }

  ngOnInit() {

  }
  public paginaBackup(url){
    this.router.navigate(url);
  }

}
