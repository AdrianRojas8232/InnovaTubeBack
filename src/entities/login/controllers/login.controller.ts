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
  
  contieneSQL(input: string): boolean {

    let sqlRegex = /(select|insert|update|delete|alter|create|drop|truncate|grant|revoke|commit|rollback|savepoint)\b/i;

    return sqlRegex.test(input);
  }

  @Post('registrar')
  async postInsertar(@Req() req: Request, @Res() res: Response) {    
    
    this.serviceResponse = await this.service.registrarUsuario(req.body);    
    res.send(this.serviceResponse);

  }

  // @Post('iniciarSesion')
  // async postInsertar(@Req() req: Request, @Res() res: Response) {    
  //   let serviceResponse;
    
  //   // Validar si el campo de nombre o contraseña está vacío o nulo
  //   if (!req.body.nombre || req.body.nombre.trim() === '' || !req.body.contra || req.body.contra.trim() === '') {
  //     return res.send({
  //       status: -1,
  //       mensaje: "Debe llenar ambos campos de nombre y contraseña"
  //     });
  //   }

  //   // Validar si el nombre o la contraseña contienen SQL
  //   if (this.contieneSQL(req.body.nombre) || this.contieneSQL(req.body.contra)) {
  //     return res.send({
  //       status: -1,
  //       mensaje: "El nombre y la contraseña no pueden contener consultas SQL"
  //     });
  //   }
      
  //   serviceResponse = await this.service.iniciarSesion(req.body);
  //   res.send(serviceResponse);
  // }
  
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
