import {AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../Servicios/user/user.service';
import {Utilerias} from '../../../../Utilerias/Util';

import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements AfterViewInit {
  public msj;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
      display: false,
      fullWidth: true,
    },showLines: true,
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          console.log(label);
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

  // @ViewChildren("colorCategorias") colorCategorias = ElementRef;
  @ViewChildren("colorCategorias") colorCategorias: QueryList<"colorCategorias">;

  constructor(private route: ActivatedRoute,
              private router: Router, private userService: UserService, private util: Utilerias, private renderer: Renderer2) {
    this.resetpiechar();
    this.msj = "Creando Grafica de movimientos negativos del usuario solicitado";
    this.util.crearLoading().then(() => {
      this.userService.obtValoresGrafica(this.userService.User.id_user, "neg").subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.detenerLoading();
        this.util.msjErrorInterno(error);
      });
    });
  }

  ngAfterViewInit() {
    // console.log("this.colorCategorias", this.query.forEach(color => console.log(color)));
  }

  public busquedaFiltrosGastos() {
    this.resetpiechar();
    this.msj = "Generando Grafica de Gastos, ¡ Porfavor espere !";
    this.util.crearLoading().then(() => {
      this.userService.obtValoresGrafica(this.userService.User.id_user, "neg", this.backup, this.account, this.year, this.month).subscribe(result => {
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
      this.colorCategorias.changes.subscribe(() => {
        this.prueba();
      });
    }
  }

  private resetpiechar() {
    this.pieChartLabels = [];
    this.pieChartData = [];
    this.pieChartColors[0].borderColor = [];
    this.pieChartColors[0].backgroundColor = [];
  }

  public prueba() {
    for (let pos = 0; pos < this.colorCategorias['_results'].length; pos++) {
      this.renderer.setStyle(this.colorCategorias['_results'][pos].nativeElement, "background", this.pieChartColors[0].backgroundColor[pos]);
    }
  }

}
