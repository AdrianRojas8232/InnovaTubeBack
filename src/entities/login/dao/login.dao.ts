import { DatabaseService } from '../../../database/services/database.service';
import { LoginModel, UserModel, RegistroModel } from '../models/login.model';
import { RowDataPacket  } from 'mysql2';

export class LoginDao {
  constructor() {}

  static async consultarUsuario(credenciales: any): Promise<any> {
    
    // console.log(credenciales);
    let sql;
    let correo: String = credenciales.usuario;
    
    try {

        sql = 'SELECT * FROM innova_tube.usuario WHERE correo = ?;';

        const values = [correo];
        
        const result = await DatabaseService.executeQuery(sql, values);
        
        return result[0];
        
    } catch (error) {
        console.error('Error en LoginDao:', error);
        throw error;
    }
  }

  static async registrarUsuario(usuario: RegistroModel): Promise<any> {    
    let sql;    
    try {
      sql = `INSERT INTO innovatube.usuarios (nombre_completo, contrasenia, correo_electronico, fecha_nacimiento, fecha_mod, estatus) VALUES (?, ?, ?, ?, now(), 0);`;
      const values = [
        usuario.nombre_completo,
        usuario.contrasenia,
        usuario.correo_electronico,
        usuario.fecha_nacimiento
      ];      
      const consulta: any = await DatabaseService.executeQuery(sql, values);
      this.registrarRolUsuario();
      return consulta;
        
    } catch (error) {
        console.error('Error en LoginDao:', error);
        return error;
    }
  }

  static async ValidarUsuario(usuario: LoginModel): Promise<any> {
    
    let sql;
    
    try {

        sql = 'select correo_electronico,contrasenia,id_usaurio,estatus,fecha_mod,nombre_completo from innovatube.usuarios where correo_electronico = ?;';

        const values = [
            usuario.correo
          ];
        
        const result: any = await DatabaseService.executeQuery(sql, values);

        if (!result[0]){
          return result[0];
        }

        return {
          correo: result[0].correo_electronico,
          contrasenia: result[0].contrasenia,
          idUsuario: result[0].id_usaurio,
          estatus: result[0].estatus,
          fecha_mod: result[0].fecha_mod,
          nombreUsuario : result[0].nombre_completo,
        };
        
    } catch (error) {
        console.error('Error en LoginDao:', error);
        throw error;
    }
  }

  static async cambiarEstatus(estatus: number,idUsuario: String): Promise<any> {
    
    let sql;
    
    try {

        sql = `update innovatube.usuarios set estatus = ${estatus} where id_usaurio = ?;`;

        const values = [
            idUsuario
          ];
        
        const result: any = await DatabaseService.executeQuery(sql, values);
      
        return result;
        
    } catch (error) {
        console.error('Error en LoginDao:', error);
        throw error;
    }
  }

  static async cambiarContrasenia(correo: String,contrasenia: String): Promise<any> {
    
    let sql;
    
    try {

        sql = `update innovatube.usuarios set contrasenia = ?, fecha_mod = now() where correo_electronico = ?;`;

        const values = [
            contrasenia,
            correo
          ];
        
        const result: any = await DatabaseService.executeQuery(sql, values);
      
        return result;
        
    } catch (error) {
        console.error('Error en LoginDao:', error);
        throw error;
    }
  }

  static async consultarRol(idUsuario: String,): Promise<any> {
    let sql;
    try {
      sql = `SELECT u.id_rol, r.nombre, u.id_usaurio FROM innovatube.roles_usuario u
      JOIN innovatube.roles r ON r.id_rol = u.id_rol
      WHERE u.id_usaurio = ?;`;
      const values = [
        idUsuario
      ];        
      const result: any = await DatabaseService.executeQuery(sql, values);
      return {
        rolUsuario: result[0].id_rol,
        nombreRol:  result[0].nombre,
        idUsuario:  result[0].id_usaurio
      }        
    
    } catch (error) {
        console.error('Error en LoginDao:', error);
        throw error;
    }
  }
  static async registrarRolUsuario(): Promise<any> {    
    let sql;    
    try {
      sql = `INSERT INTO innovatube.roles_usuario (id_rol, id_usaurio)
              VALUES ('2',(SELECT MAX(id_usaurio) FROM innovatube.usuarios) 
            );`;   
      const consulta: any = await DatabaseService.executeQuery(sql);
      return consulta;
        
    } catch (error) {
        console.error('Error en LoginDao:', error);
        return error;
    }
  }

  static async obtenerListaUsuarios(): Promise<any[]> {
    let sql;
    try {
      sql = `SELECT u.nombre_completo,UPPER(r.nombre) AS estatus FROM innovatube.usuarios u
      JOIN innovatube.roles_usuario ru ON ru.id_usaurio = u.id_usaurio
      JOIN innovatube.roles r ON r.id_rol = ru.id_rol;`;
      const consulta: any[] = await DatabaseService.executeQuery(sql);
    
      const listaUsuariosTransformada = consulta.map(usuario => {
        return {
          nombre: usuario.nombre_completo,
          status: usuario.estatus
        };
      });  
      return listaUsuariosTransformada;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      throw error;
    }
  }
  
  
}
