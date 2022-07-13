import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { Database } from '../utils/database';

@Module({
  controllers: [TrackController],
  providers: [TrackService, Database],
})
export class TrackModule {}
