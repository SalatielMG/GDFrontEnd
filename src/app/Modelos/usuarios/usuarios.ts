export class Usuarios {
  id: number;
  email: string;
  password: string;
  tipo: string;
  cargo: string;
  imagen: string;
  constructor(
    id = 0,
    email = "",
    password: "",
    tipo: "",
    cargo: "",
    imagen: "",
  ) {
    this.id = id;
    this.email =  email;
    this.password = password;
    this.tipo = tipo;
    this.cargo = cargo;
    this.imagen = imagen;
  }
}
