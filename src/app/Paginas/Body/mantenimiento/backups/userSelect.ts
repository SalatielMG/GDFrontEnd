export class UserSelect {
  id: number;
  email: string;
  cantidadBackups: number;
  index: number;
  constructor(id = 0, email = "", cantidadBackups = 0, index = 0) {
    this.id = id; this.email = email; this.cantidadBackups = cantidadBackups; this.index = index;
  }
}
