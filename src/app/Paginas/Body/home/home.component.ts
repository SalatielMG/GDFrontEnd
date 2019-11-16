import { Component } from '@angular/core';
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
export class HomeComponent {

  public usuarioSearch: FormGroup = null;

  constructor(public formBuilder: FormBuilder, public util: Utilerias, public userService: UserService, public route: ActivatedRoute,
              public router: Router) {
    this.construirFormulario();

  }

  public construirFormulario() {
    this.usuarioSearch = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public search() {
    this.util.msjLoading = "Buscando Usuario: "+ this.usuarioSearch.value.email +" y backups relacionados";
    this.util.crearLoading().then(() => {
      this.userService.buscarUser(this.usuarioSearch.value.email).subscribe(result => {
          if (!result.error) {
            this.userService.User = <Users>result.user;
            this.userService.actualizarStorageUser();
            this.router.navigate(['home/backups']);
          }
          this.util.msjToast(result.msj, result.titulo, result.error);
          this.util.detenerLoading();
        },
        error => {
          this.util.msjErrorInterno(error);
        });
    });
  }
}
