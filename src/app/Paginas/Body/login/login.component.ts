import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../../Servicios/usuario/usuario.service';
import { Utilerias } from '../../../Utilerias/Util';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public usuario: FormGroup;

  constructor(public userSerevice: UsuarioService, public formBuilder: FormBuilder, public util: Utilerias, public route: ActivatedRoute,
              public router: Router) { }

  ngOnInit() {
    this.construirFormulario();
  }

  public construirFormulario() {
    this.usuario = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      pass: ['', Validators.required]
    });
  }

  public login() {
    console.log(this.usuario.value);
    this.util.crearLoading().then(()=> {
      this.userSerevice.login(this.usuario.value).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result. titulo, result.error);
        if (!result.error){
          if (!result.usuario.error) {
            this.userSerevice.isSesionOpen = true;
            this.userSerevice.usuarioCurrent = result.usuario.usuarios[0];
            this.userSerevice.actualizarStorage();
            this.router.navigate(['/home']);
          } else {
            this.util.msjToast(result.usuario.msj + ". Porfavor verifique otra vez su sesión o pongase en contacto con el superAdministrador", result.usuario.titulo, result.usuario.error);
          }
        }
        console.log("resultado Login:=", result);
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
}
