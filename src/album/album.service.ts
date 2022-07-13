import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Database } from '../utils/database';
import { AlbumEntity } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(private readonly db: Database) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    return await this.db.addAlbum(createAlbumDto);
  }

  async findAll(): Promise<AlbumEntity[]> {
    return await this.db.getAlbums();
  }

  async findOne(id: string): Promise<AlbumEntity> {
    return await this.db.getAlbumById(id);
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    return await this.db.updateAlbum(id, updateAlbumDto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.db.deleteAlbum(id);
  }
}
