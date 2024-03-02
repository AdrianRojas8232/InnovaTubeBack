import { Module } from '@nestjs/common';
import { YoutubeController } from './controllers/youtube.controller';
import { YoutubeService } from './services/youtube.service'


@Module({
  controllers: [YoutubeController],
  providers: [
    YoutubeService
  ],
})
export class YoutubeModule {}
