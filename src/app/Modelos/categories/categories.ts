export class Categories {
  private id_backup: number;
  private id_category: number;
  private id_account: number;
  private name: string;
  private sign: string;
  private icon_name: string;
  private number: number;

  constructor(
    id_backup = 0,
    id_category = 0,
    id_account = 0,
    name = "",
    sign = "-",
    icon_name = "",
    number = 0
  ) {
  this.id_backup = id_backup;
  this.id_category = id_category;
  this.id_account = id_account;
  this.name = name;
  this.sign = sign;
  this.icon_name = icon_name;
  this.number = number;
  }

  public setId_backup(id_backup) {
    this.id_backup = id_backup;
  }
  public setId_category(id_category) {
    this.id_category = id_category;
  }
  public setId_account(id_account) {
    this.id_account = id_account;
  }
  public setName(name) {
    this.name = name;
  }
  public setSign(sign) {
    this.sign = sign;
  }
  public setIcon_name(icon_name) {
    this.icon_name = icon_name;
  }
  public setNumber(number) {
    this.number = number;
  }


  public getId_backup() {
    return this.id_backup;
  }
  public getId_category() {
    return this.id_category;
  }
  public getId_account() {
    return this.id_account;
  }
  public getName() {
    return this.name;
  }
  public getSign() {
    return this.sign;
  }
  public getIcon_name() {
    return this.icon_name;
  }
  public getNumber() {
    return this.number;
  }

}
