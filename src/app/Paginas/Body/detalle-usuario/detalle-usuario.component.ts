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
    /*this.route.paramMap.subscribe(params => {
      this.user = JSON.parse(params.get('user'));
      console.log('Value User Receive in DetalleUsuarioComponent', this.user);
    });*/
    //this.router.navigate(["gastos"], {relativeTo: this.route});

    // this.msj = "Creando Grafica de movimientos negativos del usuario solicitado";
    /*this.util.crearLoading().then(() => {
      this.userService.obtValoresGrafica(this.userService.User.id_user).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.etiquetas = result.labels;
          this.valores = result.values;
          this.grafica();
        }
        console.log("Valor etiquetas", this.etiquetas);
        console.log("Valor valores", this.valores);

      }, error => {
        this.util.detenerLoading();
        this.util.msjErrorInterno(error);
      });
    });*/
  }
  /*private grafica() {
    // pie chart:

    this.PieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: this.etiquetas,
        datasets: [{
          label: '# of Votes',
          data: this.valores, // Valores de cada categoria.
          backgroundColor: this.util.backgroundColor.slice(0, (this.etiquetas.length - 1)),
          borderColor: this.util.borderColor.slice(0, (this.etiquetas.length - 1)),
          borderWidth: 1
        }]
      },
      options: {
        title:{
          text:"Categorias",
          display:true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  }*/

  ngOnInit() {

  }
  public paginaBackup(url){
    this.router.navigate(url);
  }

}
