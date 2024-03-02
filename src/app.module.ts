import { Module } from '@nestjs/common';
import { LoginModule } from './entities/login/login.module';
import { YoutubeModule } from './entities/youtube/youtube.module';

@Module({
  controllers: [],
  imports: [
    LoginModule,
    YoutubeModule
  ],
})
export class AppModule {}