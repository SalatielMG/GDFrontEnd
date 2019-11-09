import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../../Servicios/usuario/usuario.service';
import { Utilerias } from '../../../Utilerias/Util';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public usuario: FormGroup;
  public faCheck = faCheck;

  constructor(public userSerevice: UsuarioService, public formBuilder: FormBuilder, public util: Utilerias, public route: ActivatedRoute,
              public router: Router) { }

  ngOnInit() {
    this.construirFormulario();
  }

  public construirFormulario() {
    this.usuario = this.formBuilder.group({
      email: ['', Validators.email],
      pass: ['', Validators.required]
    });
  }

  public login() {
    console.log(this.usuario.value);
    this.util.crearLoading().then(()=> {
      this.userSerevice.login(this.usuario.value).subscribe(result => {
        this.util.msjToast(result.msj, result. titulo, result.error);
        this.util.detenerLoading();
        if (!result.error){
          this.userSerevice.id = result.id;
          if (!result.usuario.error)
            this.userSerevice.UsuarioCurrent = result.usuario.usuarios[0];
          this.userSerevice.actualizarStorage();
          this.router.navigate(['/home']);
        }
        console.log("resultado Login:=", result);
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
}
