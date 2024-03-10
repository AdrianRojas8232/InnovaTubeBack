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

      sql = `INSERT INTO innovatube.usuarios (nombre_completo, contrasenia, correo_electronico, fecha_nacimiento, fecha_mod, estatus) VALUES (?, ?, ?, ?, now(), 1);`;

      const values = [
        usuario.nombre_completo,
        usuario.contrasenia,
        usuario.correo_electronico,
        usuario.fecha_nacimiento
      ];
      
      const consulta: any = await DatabaseService.executeQuery(sql, values);
      
      return consulta;
        
    } catch (error) {
        console.error('Error en LoginDao:', error);
        return error;
    }
  }

  static async ValidarUsuario(usuario: LoginModel): Promise<any> {
    
    let sql;
    
    try {

        sql = 'select correo_electronico,contrasenia,id_usaurio,estatus from innovatube.usuarios where correo_electronico = ?;';

        const values = [
            usuario.correo
          ];
        
        const result: any = await DatabaseService.executeQuery(sql, values);
      
        return {
          correo: result[0].correo_electronico,
          contrasenia: result[0].contrasenia,
          idUsuario: result[0].id_usaurio,
          estatus: result[0].estatus
        };
        
    } catch (error) {
        console.error('Error en LoginDao:', error);
        throw error;
    }
  }

}
