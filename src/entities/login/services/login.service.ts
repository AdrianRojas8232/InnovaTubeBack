import { Injectable } from '@nestjs/common';
import { ErrorMessage, SuccessfulMessage } from '../../../common/utils/movimientos.utils';
import { LoginModel, UserModel } from '../models/login.model';
import { LoginDao } from '../dao/login.dao';
import axios from 'axios';
import bcrypt from 'bcrypt';

@Injectable()
export class LoginService {

  constructor(
    ) {}

  async consultarUsuario(credenciales: LoginModel): Promise<object | string | any> {

    try {
                
        let consulta: UserModel= await LoginDao.consultarUsuario(credenciales);
        
        if (!consulta){
            return{
                status: 0,
                mensaje: "Credenciales incorrectas",
            };
        }

        const contraseniaCorrecta = await bcrypt.compare(credenciales.contrasenia, consulta.contrasenia);

        if(!contraseniaCorrecta){
            return{
                status: -1,
                mensaje: "Contraseña incorrecta"
            };
        }
        
        return{
            status: 1,
            mensaje: "Inisio de sesion exitoso",
            data:{
                usuario: consulta.nombre,
                correo: consulta.correo
            }
        };
        
    } catch (error: any) {
      console.error('Error en LoginService:', error);
      return `Error en LoginService- Función: consultarUsuario - ${error.message}`;
    }
  }

  async registrarUsuario(usuario: UserModel): Promise<object | string | any> {

    try {
            
        
        const hashedPassword = await bcrypt.hash(usuario.contrasenia, 10);
        usuario.contrasenia = hashedPassword;
        let registro = await LoginDao.registrarUsuario(usuario);
        
        if(!registro){
          return{
            status: 0,
            mensaje: "Error al insertar regisxtro",
          };

        }
        if(registro.insertId){
          return{
            status: 1,
            mensaje: "Registro exitoso",
          };
        }
        
    } catch (error: any) {
      console.error('Error en LoginService:', error);
      return `Error en LoginService- Función: registrarUsuario - ${error.message}`;
    }
  }

  async iniciarSesion(usuario: any): Promise<object | string | any> {

    try {

      let registro = await LoginDao.ValidarUsuario(usuario);
      
      if(registro){
        return {
          status: 1,
          mensaje: "Inicio Exitoso"
        }
      }else{
        return {
          status: 0,
          mensaje: "Usuario Incorrecto"
        }
      }
        
    } catch (error: any) {
      console.error('Error en LoginService:', error);
      return `Error en LoginService- Función: iniciarSesion - ${error.message}`;
    }
  }

}
