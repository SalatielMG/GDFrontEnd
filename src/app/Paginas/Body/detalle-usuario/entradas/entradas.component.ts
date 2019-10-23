import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../Servicios/user/user.service';
import {Utilerias} from '../../../../Utilerias/Util';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css']
})
export class EntradasComponent implements OnInit {
  public msj;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',

      fullWidth: true,
    },showLines: false,
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: [],
      borderColor: []
    },
  ];

  /****************************************/
  public backups = [];
  public accounts = [];
  public years = [];
  public months = [];
  public backup;
  public account;
  public year;
  public month;

  constructor(private route: ActivatedRoute,
              private router: Router, private userService: UserService, private util: Utilerias) {
    this.resetpiechar();
    this.msj = "Creando Grafica de movimientos positivos del usuario solicitado";
    this.util.crearLoading().then(() => {
      this.userService.obtValoresGrafica(this.userService.User.id_user, "pos").subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.detenerLoading();
        this.util.msjErrorInterno(error);
      });
    });
  }

  ngOnInit() {
  }
  public busquedaFiltrosGastos() {
    this.resetpiechar();
    this.msj = "Generando Grafica de Entradas, ¡ Porfavor espere !";
    this.util.crearLoading().then(() => {
      this.userService.obtValoresGrafica(this.userService.User.id_user, "pos", this.backup, this.account, this.year, this.month).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.detenerLoading();
        this.util.msjErrorInterno(error);
      });
    });
  }
  private resultado(result) {
    this.util.detenerLoading();
    this.util.msjToast(result.msj, result.titulo, result.error);

    this.backups = result.backups;
    this.backup = result.ultimoBackup;

    this.accounts = result.accounts;
    this.account = result.ultimaCuenta;

    this.years = result.años;
    this.year = result.ultimoAño;

    this.months = result.meses;
    this.month = result.ultimoMes;


    if (!result.error) {
      this.pieChartLabels = result.labels;
      this.pieChartData = result.values;
      this.pieChartColors[0].backgroundColor = this.util.calcularColoreAleatorios(this.pieChartData.length);
      this.pieChartColors[0].borderColor = this.util.calcularColoreAleatorios(this.pieChartData.length,true);
      console.log(this.pieChartColors[0].backgroundColor);
      console.log(this.pieChartColors[0].borderColor);
    }
  }
  private resetpiechar() {
    this.pieChartLabels = [];
    this.pieChartData = [];
    this.pieChartColors[0].borderColor = [];
    this.pieChartColors[0].backgroundColor = [];
  }
}
