import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Database } from '../utils/database';
import { TrackEntity } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(private readonly db: Database) {}

  async create(createTrackDto: CreateTrackDto): Promise<TrackEntity> {
    return await this.db.addTrack(createTrackDto);
  }

  async findAll(): Promise<TrackEntity[]> {
    return await this.db.getTracks();
  }

  async findOne(id: string): Promise<TrackEntity> {
    return await this.db.getTrackById(id);
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<TrackEntity> {
    return await this.db.updateTrack(id, updateTrackDto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.db.deleteTrack(id);
  }
}
