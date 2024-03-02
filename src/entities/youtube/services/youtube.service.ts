import { Injectable } from '@nestjs/common';
import { ErrorMessage, SuccessfulMessage } from '../../../common/utils/movimientos.utils';
import axios from 'axios';
import bcrypt from 'bcrypt';

@Injectable()
export class YoutubeService {
    public url: string = process.env.YOUTUBE_API_URL as string;
    public key: string = process.env.YOUTUBE_API_KEY as string;
    public type: string = 'video';
    public part: string = 'snippet';
    public maxResults: number = 10;

  constructor(
    ) {}

  async obtenerVideos(busqueda: String): Promise<object | string | any> {

    try {

        const requestUrl = `${this.url}/search?key=${this.key}&type=${this.type}&part=${this.part}&maxResults=${this.maxResults}&q=${busqueda}`;

        const response = await axios.get(requestUrl);
        return response.data;
        
    } catch (error: any) {
      console.error('Error en LoginService:', error);
      return `Error en YoutubeService- Función: obtenerVideos - ${error.message}`;
    }
  }

}
