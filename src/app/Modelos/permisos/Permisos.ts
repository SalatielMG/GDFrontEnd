import {Usuarios} from '../usuarios/usuarios';

export class Permisos {
  id: number;
  permiso: string;
  descripcion: string;
  usuarios: Usuarios[] = []; // Usuarios asignados

  checked: boolean;
  constructor(
    id = 0,
    permiso = "",
    descripcion = "",
    usuarios: Usuarios[] = [],
    checked = false,
  ) {
    this.id = 0;
    this.permiso = permiso;
    this.descripcion = descripcion;
    this.usuarios = usuarios;
    this.checked = checked;
  }
}
