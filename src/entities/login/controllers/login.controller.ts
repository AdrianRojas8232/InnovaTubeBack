import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { log } from 'console';
import { Request, Response } from 'express';
import { LoginService } from '../services/login.service';
import { LoginModel, UserModel } from '../models/login.model';
import axios from 'axios';

@Controller('login')
export class LoginController {
  public serviceResponse!: any; 
  constructor(
    private service: LoginService
    ) {}
  
  @Post()
  async postLogin(@Req() req: Request, @Res() res: Response) {    
    const serviceResponse = await this.service.consultarUsuario(req.body);
    console.log(serviceResponse);
    res.send(serviceResponse);
  }
  
  // contieneSQL(input: string): boolean {
  //   let sqlRegex = /(select|insert|update|delete|alter|create|drop|truncate|grant|revoke|commit|rollback|savepoint)\b/i;
  //   console.log(input);
    
  //   return sqlRegex.test(input);
  // }
  contieneSQL(input: string): boolean {
    console.log(input);
      const sqlKeywords = ["select", "insert", "update", "delete", "alter", "create", "drop", "truncate", "grant", "revoke", "commit", "rollback", "savepoint"];
      
      const words = input.split(/\W+/);
      console.log(words);
      for (let word of words) {
          if (sqlKeywords.includes(word.toLowerCase())) {
              return true;
          }
      }
      
      return false;
  }

  contieneCaracteresEspeciales(input: string): boolean {
    let scriptRegex = /(<|>|\/|\\|%|&|;|\?|\$|#|\||{|}|'|"|`|\[|\]|!|\(|\)|=|\+|-|\*|:|@|,|\^|~|\||\.\.|<!--|\/\*|\*\/)/;
    return scriptRegex.test(input);
  }


  @Post('registrar')
  async postInsertar(@Req() req: Request, @Res() res: Response) {   
    
    // Validar si el formulario contienen SQL
    if (this.contieneSQL(req.body.nombre_completo) || this.contieneSQL(req.body.contrasenia) || this.contieneSQL(req.body.correo_electronico) ) {
      return res.send({
        status: -1,
        mensaje: "El nombre, la contraseña y el correo no pueden contener consultas SQL"
      });
    }

    // Validar si el formulario contienen caracteres especiales
    if (this.contieneCaracteresEspeciales(req.body.nombre_completo) || this.contieneCaracteresEspeciales(req.body.contrasenia)) {
      return res.send({
        status: -1,
        mensaje: "El nombre y la contraseña no pueden contener caracterespesciales"
      });
    }
    
    this.serviceResponse = await this.service.registrarUsuario(req.body);    
    res.send(this.serviceResponse);

  }

  @Post('iniciarSesion')
  async postIniciar(@Req() req: Request, @Res() res: Response) {    
    let serviceResponse;
    
    // Validar si el formulario contienen SQL
    if (this.contieneSQL(req.body.contrasenia) || this.contieneSQL(req.body.correo) ) {
      return res.send({
        status: -1,
        mensaje: "El nombre, la contraseña y el correo no pueden contener consultas SQL"
      });
    }

    // Validar si el formulario contienen caracteres especiales
    if (this.contieneCaracteresEspeciales(req.body.contrasenia)) {
      return res.send({
        status: -1,
        mensaje: "El nombre y la contraseña no pueden contener caracterespesciales"
      });
    }
    console.log(req.body);
    res.send("12345")
    // serviceResponse = await this.service.iniciarSesion(req.body);
    // res.send(serviceResponse);
  }
  
  // @Post('verificar')
  // async postCaptcha(@Req() req: Request, @Res() res: Response) {
  //   console.log(req.body);
  //   const recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify';
  //   const recaptchaSecretKey = '6Lddj18pAAAAAB6RKwRS7GpJpGBCzXgE3DT0UDQU';
  //   const token = req.params.token;

  //   const payload = {
  //     secret: recaptchaSecretKey,
  //     response: token,
  //     remoteip: req.ip,
  //   };
  //   try {
  //     const response = await axios.post(recaptchaUrl, payload);
  //     const result = response.data;
  //     console.log(result);
      
  //     res.json({ success: result.success || false });
  //   } catch (error) {
  //     console.error('Error al verificar el CAPTCHA', error);
  //     res.status(500).json({ success: false, error: 'Error interno del servidor' });
  //   }
  // }

  
}
