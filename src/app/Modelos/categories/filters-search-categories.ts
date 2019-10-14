export class FiltersSearchCategories {
  public indexAccount = {
    value: "-1",
    valueAnt: "",
    isFilter: false
  };
  public id_category = {
    value: "0",
    valueAnt: "",
    isFilter: false
  };
  public sign = {
    value: "-1",
    valueAnt: "",
    isFilter: false
  };

  constructor() {
    this.indexAccount = {
        value: "-1",
        valueAnt: "",
        isFilter: false
      };
    this.id_category = {
        value: "0",
        valueAnt: "",
        isFilter: false
      };
    this.sign = {
        value: "-1",
        valueAnt: "",
        isFilter: false
      };
  }

  /*public setIndexAccount(key, value) {
    this.indexAccount[key] = value;
  };
  public setId_category(key, value) {
    this.id_category[key] = value;
  };
  public setSign(key, value) {
    this.sign[key] = value;
  };

  public getIndexAccount(key) {
    return this.indexAccount[key];
  };
  public getId_category(key) {
    return this.id_category[key];
  };
  public getSign(key) {
    return this.sign[key];
  };*/
}
