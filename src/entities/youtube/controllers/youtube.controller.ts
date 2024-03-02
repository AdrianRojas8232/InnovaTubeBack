import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { log } from 'console';
import { Request, Response } from 'express';
import { YoutubeService } from '../services/youtube.service';

@Controller('youtube')
export class YoutubeController {

  constructor(
    private service: YoutubeService
    ) {}
  
  @Get()
  async getVideos(@Req() req: Request, @Res() res: Response) {    
    
    const serviceResponse = await this.service.obtenerVideos(req.query.busqueda as string);
    
    res.send(serviceResponse);

  }

  @Post('registrar')
  async postRegister(@Req() req: Request, @Res() res: Response) {    

  }

}
