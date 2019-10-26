export class User {
  id_user: number;
  email: string;
  password: string;
  license: number;
  android_v2: number;
  android_v3: number;
  ios: number;
  country_code: string;
  city: string;
  device_name: string;
  device_model: string;
  device_os_version: string;
  version_v2:string;
  version_v3: string;
  version_ios: string;
  constructor(
    id_user = 0,
    email = "",
    password = "",
    license = 0,
    android_v2 = 0,
    android_v3 = 0,
    ios = 0,
    country_code = "",
    city = "",
    device_name = "",
    device_model = "",
    device_os_version = "",
    version_v2 ="",
    version_v3 = "",
    version_ios = ""
  ) {
    this.id_user = id_user;
    this.email = email;
    this.password = password;
    this.license = license;
    this.android_v2 = android_v2;
    this.android_v3 = android_v3;
    this.ios = ios;
    this.country_code = country_code;
    this.city = city;
    this.device_name = device_name;
    this.device_model = device_model;
    this.device_os_version = device_os_version;
    this.version_v2 = version_v2;
    this.version_v3 = version_v3;
    this.version_ios = version_ios;
  }
}
