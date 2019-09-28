export class UserSelect {
  id: number;
  email: string;
  cantidadBackus: number;
  index: number;
  constructor(id = 0, email = "", cantidadBackups = 0, index = 0) {
    this.id = id; this.email = email; this.cantidadBackus = cantidadBackups; this.index = index;
  }
}
