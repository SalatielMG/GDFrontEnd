import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {UsuarioService} from '../../../../Servicios/usuario/usuario.service';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Usuarios} from '../../../../Modelos/usuarios/usuarios';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  @ViewChild("cntPermisos", {read: "", static: false}) cntPermisos = ElementRef;
  private isExpandCntPermisos: boolean = true;
  private Usuario: FormGroup = null;

  constructor(private usuarioService: UsuarioService, private util: Utilerias, private renderer: Renderer2, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
  }

  private actionUpdateUsuario(){
    this.buildForm();
  }
  private buildForm() {
    this.Usuario = this.formBuilder.group({
      id: [this.usuarioService.UsuarioCurrent.id, [Validators.required]],
      email: [this.usuarioService.UsuarioCurrent.email, [Validators.required, Validators.email, Validators.maxLength(50)]],
      tipo: [this.usuarioService.UsuarioCurrent.tipo, [Validators.required]],
      cargo: [this.usuarioService.UsuarioCurrent.cargo, [Validators.required]]
      //imagen: [usuario.imagen, ],
    });
  }
  private getError(controlName: string): string {
    let error = '';
    const control = this.Usuario.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }

  private closeModal() {
    this.util.cerrarModal("#modalUsuarioUpdate").then(() => {
      this.Usuario = null;
    });
  }

  private UpdateUsuario(){
    console.log("Value Usuario Form:= ", this.Usuario.value);
  }

  private actualizarImagen($event) {

  }

  private verficarExpansion() {
    this.renderer.setStyle(this.cntPermisos['nativeElement'], "transition", "height 500ms, max-height 500ms, padding 500ms");
    if (this.isExpandCntPermisos) { // Expandir
      //             this.expandir(575, 13, this.cntBackupsUser['_results'][indice].nativeElement);
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "height", 575 + "px");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "max-height", 575 + "px");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "padding", 13 + "px 16px")
    } else { // Ocultar
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "height", "0px");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "max-height", "0px");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "padding", "0px 16px");
    }
    this.isExpandCntPermisos = !this.isExpandCntPermisos;
  }

}
