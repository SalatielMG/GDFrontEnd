export class Usuarios {
  id: number;
  email: string;
  password: string;
  tipo: string;
  cargo: string;
  imagen: string;

  checked: boolean;
  constructor(
    id = 0,
    email = "",
    password: "",
    tipo: "",
    cargo: "",
    imagen: "",
    checked: false,
  ) {
    this.id = id;
    this.email =  email;
    this.password = password;
    this.tipo = tipo;
    this.cargo = cargo;
    this.imagen = imagen;
    this.checked = checked;
  }
}
