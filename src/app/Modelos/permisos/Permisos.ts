import {Usuarios} from '../usuarios/usuarios';

export class Permisos {
  permiso: string;
  descripcion: string;
  usuarios: Usuarios[] = []; // Usuarios asignados
  constructor(
    permiso = "",
    descripcion = "",
    usuarios: Usuarios[] = []
  ) {
    this.permiso = permiso;
    this.descripcion = descripcion;
    this.usuarios = usuarios;
  }
}
