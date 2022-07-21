import { Injectable } from '@nestjs/common';
import { db } from '../utils/database';
import { FavEntity } from './entities/fav.entity';

@Injectable()
export class FavsService {
  private readonly db;
  constructor() {
    this.db = db;
  }

  async addTrackToFav(id: string) {
    return await this.db.addFavoriteTrack(id);
  }

  async addArtistToFav(id: string) {
    return await this.db.addFavoriteArtist(id);
  }

  async addAlbumToFav(id: string) {
    return await this.db.addFavoriteAlbum(id);
  }

  async findAll(): Promise<FavEntity> {
    return await this.db.getFavorites();
  }

  async removeTrackFromFav(id: string) {
    return await this.db.deleteFavoriteTrack(id);
  }

  async removeArtistFromFav(id: string) {
    return await this.db.deleteFavoriteArtist(id);
  }

  async removeAlbumFromFav(id: string) {
    return await this.db.deleteFavoriteAlbum(id);
  }
}
