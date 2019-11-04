import {Usuarios} from '../usuarios/usuarios';

export class Permisos {
  permiso: string;
  descripcion: string;
  usuarios: Usuarios[] = []; // Usuarios asignados

  checked: boolean;
  constructor(
    permiso = "",
    descripcion = "",
    usuarios: Usuarios[] = [],
    checked = false,
  ) {
    this.permiso = permiso;
    this.descripcion = descripcion;
    this.usuarios = usuarios;
    this.checked = checked;
  }
}
