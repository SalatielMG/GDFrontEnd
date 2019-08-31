import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilerias } from '../../../Utilerias/Util';
import { UserService } from '../../../Servicios/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../Modelos/User/user';


@Component({
  selector: 'app-encode-mx',
  templateUrl: './encode-mx.component.html',
  styleUrls: ['./encode-mx.component.css']
})
export class EncodeMXComponent implements OnInit {

  public usuarioSearch: FormGroup;

  constructor(public formBuilder: FormBuilder, private util: Utilerias, public userService: UserService, private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.construirFormulario();
  }

  public construirFormulario() {
    this.usuarioSearch = this.formBuilder.group({
      email: ['', Validators.email],
    });
  }

  public search() {
    console.log(this.usuarioSearch.value);
    this.util.crearLoading().then(() => {
      this.userService.buscarUser(this.usuarioSearch.value.email).subscribe(result => {

          if (!result.error) {
            this.userService.User = <User>result.user;
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
