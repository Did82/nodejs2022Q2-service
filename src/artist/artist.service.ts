import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { db } from '../utils/database';
import { ArtistEntity } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  // constructor(private readonly db: Database) {}
  private readonly db;
  constructor() {
    this.db = db;
  }
  async create(createArtistDto: CreateArtistDto): Promise<ArtistEntity> {
    return await this.db.addArtist(createArtistDto);
  }

  async findAll(): Promise<ArtistEntity[]> {
    return await this.db.getArtists();
  }

  async findOne(id: string): Promise<ArtistEntity> {
    return await this.db.getArtistById(id);
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    return await this.db.updateArtist(id, updateArtistDto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.db.deleteArtist(id);
  }
}
