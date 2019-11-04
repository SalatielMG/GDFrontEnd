import {Permisos} from '../permisos/Permisos';

export class Usuarios {
  id: number;
  email: string;
  password: string;
  tipo: string;
  cargo: string;
  imagen: string;
  permisos: Permisos[] = [];

  checked: boolean;
  constructor(
    id = 0,
    email = "",
    password = "",
    tipo = "aux",
    cargo = "",
    imagen = "",
    permisos: Permisos[] = [],
    checked = false,
  ) {
    this.id = id;
    this.email =  email;
    this.password = password;
    this.tipo = tipo;
    this.cargo = cargo;
    this.imagen = imagen;
    this.permisos = permisos;
    this.checked = checked;
  }
}
