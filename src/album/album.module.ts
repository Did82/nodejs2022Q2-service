import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Database } from '../utils/database';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, Database],
})
export class AlbumModule {}
