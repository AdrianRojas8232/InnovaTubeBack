import { Injectable } from '@nestjs/common';
import { ErrorMessage, SuccessfulMessage } from '../../../common/utils/movimientos.utils';
import { LoginModel, UserModel, RegistroModel } from '../models/login.model';
import { LoginDao } from '../dao/login.dao';
import axios from 'axios';
import bcrypt from 'bcrypt';

@Injectable()
export class LoginService {

  constructor(
    ) {}

  async registrarUsuario(usuario: RegistroModel): Promise<object | string | any> {

    try {
      let mensaje;

      const hashedPassword = await bcrypt.hash(usuario.contrasenia, 10);
      usuario.contrasenia = hashedPassword;
      let registro = await LoginDao.registrarUsuario(usuario);
      
      if(registro.errno){
        if(registro.errno === 1062){
          mensaje = "CORREO EXISTENTE.";
        }else{
          mensaje = "ERROR AL registrar.";
        }
        return{
          estatus: -1,
          mensaje: mensaje
        }
      }else{
        mensaje="REGISTRO EXITOSO."
      }
      return{
        estatus: 1,
        mensaje: mensaje
      }
        
    } catch (error: any) {
      console.error('Error en LoginService:', error);
      return `Error en LoginService- Función: registrarUsuario - ${error.message}`;
    }
  }

  async iniciarSesion(usuario: LoginModel): Promise<object | string | any> {

    try {
      console.log(usuario);
      
      let registro = await LoginDao.ValidarUsuario(usuario);
      
      if (!registro) {
        return {
          status: -1,
          mensaje: "Usuario incorrecto"
        }
      }
      const contraseniaCorrecta = await bcrypt.compare(usuario.contrasenia, registro.contrasenia);
      console.log();
      
      if(contraseniaCorrecta){
        return {
          status: 1,
          mensaje: "Inicio Exitoso"
      }
      }else{
        return {
          status: -1,
          mensaje: "Contraseña incorrecta"
        }
      }
        
    } catch (error: any) {
      console.error('Error en LoginService:', error);
      return `Error en LoginService- Función: iniciarSesion - ${error.message}`;
    }
  }

}
