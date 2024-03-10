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
  
  contieneSQL(input: string): boolean {
    let sqlRegex = /(select|insert|update|delete|alter|create|drop|truncate|grant|revoke|commit|rollback|savepoint)/i;
    return sqlRegex.test(input);
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
  
    serviceResponse = await this.service.iniciarSesion(req.body);
    res.send(serviceResponse);
  }
    
}
