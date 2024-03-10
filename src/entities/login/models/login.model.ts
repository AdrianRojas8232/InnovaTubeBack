export class RegistroModel{
  nombre_completo!: string;
  contrasenia!: string;
  correo_electronico!: string;
  fecha_nacimiento!: string;
  constructor(nombre_completo: string, contrasenia: string, correo_electronico: string, fecha_nacimiento: string) {
    this.nombre_completo = nombre_completo;
    this.contrasenia = contrasenia;
    this.correo_electronico = correo_electronico;
    this.fecha_nacimiento = fecha_nacimiento;
    }
}

export class LoginModel {
    correo!: string;
    contrasenia!: string;
    
    constructor(correo: string, contrasenia: string) {
      this.correo = correo;
      this.contrasenia = contrasenia;
      

    }
}

export class IdUsuarioModel {
  idUsuario!: string;
  
  constructor(idUsuario: string) {
    this.idUsuario = idUsuario;    

  }
}

export class UserModel {
    id_usuario!: number;
    ap_paterno!: String;
    ap_materno!: String;
    nombre!: String;
    correo!: String;
    contrasenia!: string;
    
    constructor(id_usuario: number, ap_paterno: string, ap_materno: string, nombre: string, correo: string, contrasenia: string) {
    this.id_usuario = id_usuario;
    this.ap_paterno = ap_paterno;
    this.ap_materno = ap_materno;
    this.nombre = nombre;
    this.correo = correo;
    this.contrasenia = contrasenia;
    }
}