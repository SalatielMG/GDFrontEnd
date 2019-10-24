import {AfterViewInit, Component, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../Servicios/user/user.service';
import {Utilerias} from '../../../../Utilerias/Util';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


import html2canvas from 'html2canvas';


@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css']
})
export class EntradasComponent implements AfterViewInit {
  public msj;
  public pieChartOptions: ChartOptions = {
    devicePixelRatio: 2,
    aspectRatio: 1.3,
    responsive: true,
    legend: {
      display: false,
      position: 'top',
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

  @ViewChildren("colorCategorias") colorCategorias: QueryList<"colorCategorias">;

  constructor(private route: ActivatedRoute,
              private router: Router, private userService: UserService, private util: Utilerias, private renderer: Renderer2) {
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
      this.renderer.setStyle(this.colorCategorias['_results'][pos].nativeElement, "background-color", this.pieChartColors[0].backgroundColor[pos]);
      this.renderer.setStyle(this.colorCategorias['_results'][pos].nativeElement, "border", "1px solid " + this.pieChartColors[0].borderColor[pos]);
    }
  }
  public exportPDF()
  {
    var data = document.getElementById('dataUserExport');
    var logoEMX = document.getElementById('logoEncodeMX');
    html2canvas(logoEMX, { scale: 3}).then(canvaslogoEMX => {
      html2canvas(data, { scale: 3}).then(canvas => {
        var img = canvas.toDataURL("image/png");
        var imgLogo = canvaslogoEMX.toDataURL("image/png");
        var imgWidth = 216;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        const documentDefinition = {
          defaultStyle: {
            fontSize: 20,
            bold: true,
          },
          info: {
            title: 'Reporte Entradas Usuario ' + this.userService.User.email,
            author: 'EncodeMX',
            subject: 'Reporte Entradas',
            keywords: 'Gastos diarios.',
          },
          pageSize: 'letter',

          pageOrientation: 'portrait',
          styles: {
            imgLogo: {
              borderBottom: ['#000000'],
            },
            header: {
              fontSize: 15,
              alignment: 'center',
              bold: false,
              bodyFontFamily: 'Century Gothic',
              marginBottom: 5
            },
            anotherStyle: {
              fontSize: 12,
              bold: false,
              fontWeight: 'lighter',
              bodyFontFamily: 'Century Gothic',
              alignment: 'center',
              marginBottom: 50
            }
          },
          pageMargins: [ 5, 15, 5, 5],

          content: [
            {
              image: imgLogo,
              height:  10 * 11,
              width: 50 * 11,
              alignment: 'center',
            },
            {
              text: 'Reporte entradas', style: 'header'
            },
            {
              text: 'Usuario: ' + this.userService.User.email, style: 'anotherStyle'
            },
            {
              image: img,
              width: imgWidth * 2.78,
              height: imgHeight * 2.78}]
        };
        pdfMake.createPdf(documentDefinition).open();

      });
    });

  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

}
