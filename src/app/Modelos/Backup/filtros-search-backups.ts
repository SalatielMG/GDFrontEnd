export class FiltrosSearchBackups {
  id_backup = {
    value: "",
    isFilter: false
  };
  email = {
    value: "",
    isFilter: false
  };
  automatic = {
    value: "-1",
    isFilter: false
  };
  date_creation = {
    value:  "",
    isFilter: false
  };
  date_download = {
    value:  "",
    isFilter: false
  };
  created_in = {
    value: "",
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
