import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilerias } from '../../../Utilerias/Util';
import { UserService } from '../../../Servicios/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Users } from '../../../Modelos/users/users';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public usuarioSearch: FormGroup;

  constructor(public formBuilder: FormBuilder, private util: Utilerias, public userService: UserService, private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.construirFormulario();
  }

  public construirFormulario() {
    this.usuarioSearch = this.formBuilder.group({
      email: ['eduardocrysnamuk@gmail.com', Validators.email],
    });
  }

  public search() {
    console.log(this.usuarioSearch.value);
    this.util.crearLoading().then(() => {
      this.userService.buscarUser(this.usuarioSearch.value.email).subscribe(result => {

          if (!result.error) {
            this.userService.User = <Users>result.user;
            this.router.navigate(['/backups']);
          }
          this.util.msjToast(result.msj, result.titulo, result.error);
          this.util.detenerLoading();
        },
        error => {
          this.util.detenerLoading();
          this.util.msjErrorInterno(error);
        });
    });

  }

}
