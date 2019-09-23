export class FiltrosSearchBackups {
  id_backup = {
    value: "",
    valueAnt: "",
    isFilter: false
  };
  email = {
    value: "",
    valueAnt: "",
    isFilter: false
  };
  automatic = {
    value: "-1",
    valueAnt: "",
    isFilter: false
  };
  date_creation = {
    value:  "",
    valueAnt: "",
    isFilter: false
  };
  date_download = {
    value:  "",
    valueAnt: "",
    isFilter: false
  };
  created_in = {
    value: "",
    valueAnt: "",
    isFilter: false
  };
  constructor(){
      this.id_backup.value = "";
      this.id_backup.isFilter = false;

      this.email.value = "";
      this.email.isFilter = false;

      this.automatic.value = "-1";
      this.automatic.isFilter = false;

      this.date_creation.value = "";
      this.date_creation.isFilter = false;

      this.date_download.value = "";
      this.date_download.isFilter = false;

      this.created_in.value = "";
      this.created_in.isFilter = false;
  }

}
