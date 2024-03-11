import { Injectable } from '@nestjs/common';
import { ErrorMessage, SuccessfulMessage } from '../../../common/utils/movimientos.utils';
import { LoginModel, UserModel, RegistroModel, IdUsuarioModel, ContraseniaModel } from '../models/login.model';
import { LoginDao } from '../dao/login.dao';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { log } from 'console';

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
      
      let registro = await LoginDao.ValidarUsuario(usuario);
      
      if (!registro) {
        return {
          status: -1,
          mensaje: "Usuario incorrecto"
        }
      }else if (registro.estatus === 2){
        return {
          status: -1,
          mensaje: "Usuario bloqueado comunicate con soporte para validar el estatus de tu cuenta."
        }
      }

      let roles = await LoginDao.consultarRol(registro.idUsuario);      
      
      const contraseniaCorrecta = await bcrypt.compare(usuario.contrasenia, registro.contrasenia);
      
      if(contraseniaCorrecta && registro.estatus === 1){
        return {
          status: -1,
          mensaje: "El usuario ya cuenta con una sesión activa"
        }
      }else if(contraseniaCorrecta){
        const fechaActual = Date.now();
        const fechaMod = new Date(registro.fecha_mod);
        const diferenciaMilisegundos = fechaActual - registro.fecha_mod;
        const diferenciaMeses = diferenciaMilisegundos / (1000 * 3600 * 24 * 30.417);
        if (diferenciaMeses > 3) {
          return {
            status: 2,
            mensaje: "Antes de iniciar sesiòn debes actualizar tu contraseña"
          }
        }
        let respuesta = await LoginDao.cambiarEstatus(1,registro.idUsuario);
        return {
          status: 1,
          mensaje: "Inicio Exitoso",
          correo: registro.correo,
          idUsuario: registro.idUsuario,
          rolUsuario: roles.rolUsuario,
          nombreRol: roles.nombreRol,
          nombreUsuario: registro.nombreUsuario
        }
      }else{
        let bolquear = await LoginDao.bloquearUsuario(registro.idUsuario);
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

  async cambiarEstatusUsuario(idUsuario: IdUsuarioModel): Promise<object | string | any> {
    
    let respuesta = await LoginDao.cambiarEstatus(0,idUsuario.idUsuario);
    return {
      status: 1,
      mensaje: "Sesion cerrada."
    };
  }

  async cambiarContrasenia(nuevaContrasenia: ContraseniaModel): Promise<object | string | any> {

    let usuario = await LoginDao.ValidarUsuario(nuevaContrasenia);
    const contraseniaCorrecta = await bcrypt.compare(nuevaContrasenia.contrasenia, usuario.contrasenia);

    if(contraseniaCorrecta){
      return{
        estatus:-1,
        mensaje: "No puedes ingresar una contraseña antigua"
      }
    }
    const hashedPassword = await bcrypt.hash(nuevaContrasenia.contrasenia, 10);
      usuario.contrasenia = hashedPassword;
    let actualizar = await LoginDao.cambiarContrasenia(nuevaContrasenia.correo, hashedPassword);

    return {
      status: 1,
      mensaje: "Contraseña actualizada correctamente."
    };
  }

  async obtenerUsuarios(): Promise<any[]> {
    try {
      const listaUsuarios = await LoginDao.obtenerListaUsuarios();
      return listaUsuarios;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      throw error; 
    }
  }

}
