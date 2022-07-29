import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const favs = await this.prisma.favs.findUnique({
      where: { id: 1 },
      select: {
        tracks: {
          select: {
            id: true,
            name: true,
            artistId: true,
            albumId: true,
            duration: true,
          },
        },
        artists: {
          select: {
            id: true,
            name: true,
            grammy: true,
          },
        },
        albums: {
          select: {
            id: true,
            name: true,
            artistId: true,
            year: true,
          },
        },
      },
    });
    return {
      tracks: favs.tracks,
      artists: favs.artists,
      albums: favs.albums,
    };
  }

  async addTrackToFav(trackId: string) {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    });
    if (!track) {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.prisma.favs.update({
      where: { id: 1 },
      data: { tracks: { connect: { id: trackId } } },
      include: { tracks: true },
    });
  }

  async addArtistToFav(artistId: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });
    if (!artist) {
      throw new HttpException(
        'Artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.prisma.favs.update({
      where: { id: 1 },
      data: { artists: { connect: { id: artistId } } },
    });
  }

  async addAlbumToFav(albumId: string) {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });
    if (!album) {
      throw new HttpException(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.prisma.favs.update({
      where: { id: 1 },
      data: { albums: { connect: { id: albumId } } },
    });
  }

  async removeTrackFromFav(trackId: string) {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    });
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.favs.update({
      where: { id: 1 },
      data: { tracks: { disconnect: { id: trackId } } },
    });
  }

  async removeArtistFromFav(artistId: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.favs.update({
      where: { id: 1 },
      data: { artists: { disconnect: { id: artistId } } },
    });
  }

  async removeAlbumFromFav(albumId: string) {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.favs.update({
      where: { id: 1 },
      data: { albums: { disconnect: { id: albumId } } },
    });
  }
}
