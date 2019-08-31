import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../../Servicios/Usuario/usuario.service';
import { Utilerias } from '../../../Utilerias/Util';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public usuario: FormGroup;

  constructor(public userSerevice: UsuarioService, public formBuilder: FormBuilder, private util: Utilerias, private route: ActivatedRoute,
              private router: Router) { }

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
        console.log('Resultado', result);
        if (!result.error){
          this.userSerevice.id = result.id;
          this.userSerevice.actualizarStorage();
          this.router.navigate(['/home']);

        }

        this.util.msjToast(result.msj, result. titulo, result.error);
        this.util.detenerLoading();
      }, error => {
        this.util.detenerLoading();

        this.util.msjErrorInterno(error);
      });
    });

  }

}
