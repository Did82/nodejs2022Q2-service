import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';

interface CreateUserDto {
  login: string;
  password: string;
}

interface UserInput {
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

interface User extends UserInput {
  id: string;
}

interface UpdatePasswordDto {
  oldPassword: string; // previous password
  newPassword: string; // new password
}

interface ArtistInput {
  name: string;
  grammy: boolean;
}

interface Artist extends ArtistInput {
  id: string;
}

interface TrackInput {
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

interface Track extends TrackInput {
  id: string;
}

interface AlbumInput {
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

interface Album extends AlbumInput {
  id: string;
}

interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

interface FavoritesRepsonse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

interface DB {
  users: User[];
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  favorites: Favorites;
}

class Database {
  private db: DB = {
    users: [],
    artists: [],
    albums: [],
    tracks: [],
    favorites: {
      artists: [],
      albums: [],
      tracks: [],
    },
  };

  constructor() {
    this.db.users = [];
    this.db.artists = [];
    this.db.tracks = [];
    this.db.albums = [];
    this.db.favorites = {
      artists: [],
      albums: [],
      tracks: [],
    };
  }

  public async getUsers(): Promise<User[]> {
    return this.db.users;
  }

  public async getArtists(): Promise<Artist[]> {
    return this.db.artists;
  }

  public async getTracks(): Promise<Track[]> {
    return this.db.tracks;
  }

  public async getAlbums(): Promise<Album[]> {
    return this.db.albums;
  }

  public async getFavorites(): Promise<FavoritesRepsonse> {
    const artists = this.db.artists.filter((artist) =>
      this.db.favorites.artists.includes(artist.id),
    );
    const albums = this.db.albums.filter((album) =>
      this.db.favorites.albums.includes(album.id),
    );
    const tracks = this.db.tracks.filter((track) =>
      this.db.favorites.tracks.includes(track.id),
    );
    return { artists, albums, tracks };
  }

  public async addUser(user: CreateUserDto): Promise<User> {
    const id = uuidv4();
    const createdAt = Date.now();
    const updatedAt = createdAt;
    const version = 1;
    // const newUser = {
    //   id,
    //   createdAt,
    //   updatedAt,
    //   version,
    //   ...user,
    // };
    const newUser: UserEntity = new UserEntity({
      id,
      createdAt,
      updatedAt,
      version,
      ...user,
    });
    this.db.users.push(newUser);
    return newUser;
  }

  public async addArtist(artist: ArtistInput): Promise<Artist> {
    const id = uuidv4();
    const newArtist = { id, ...artist };
    this.db.artists.push(newArtist);
    return newArtist;
  }

  public async addTrack(track: TrackInput): Promise<Track> {
    const id = uuidv4();
    const newTrack = { id, ...track };
    this.db.tracks.push(newTrack);
    return newTrack;
  }

  public async addAlbum(album: AlbumInput): Promise<Album> {
    const id = uuidv4();
    const newAlbum = { id, ...album };
    this.db.albums.push(newAlbum);
    return newAlbum;
  }

  public async getUserById(id: string): Promise<User> {
    const user: User = this.db.users.find((user) => user.id === id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  public async getArtistById(id: string): Promise<Artist> {
    const artist: Artist = this.db.artists.find((artist) => artist.id === id);
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    return artist;
  }

  public async getTrackById(id: string): Promise<Track> {
    const track: Track = this.db.tracks.find((track) => track.id === id);
    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    return track;
  }

  public async getAlbumById(id: string): Promise<Album> {
    const album: Album = this.db.albums.find((album) => album.id === id);
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    return album;
  }

  public async updateUser(
    id: string,
    updatePassword: UpdatePasswordDto,
  ): Promise<User> {
    const user: User = this.db.users.find((user) => user.id === id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (user.password !== updatePassword.oldPassword)
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    user.password = updatePassword.newPassword;
    user.updatedAt = Date.now();
    user.version += 1;
    this.db.users = this.db.users.map((u) => (user.id === id ? user : u));
    return user;
  }

  public async updateArtist(id: string, artist: ArtistInput): Promise<Artist> {
    const artistToUpdate: Artist = this.db.artists.find(
      (artist) => artist.id === id,
    );
    if (!artistToUpdate)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    artistToUpdate.name = artist.name;
    artistToUpdate.grammy = artist.grammy;
    this.db.artists = this.db.artists.map((artist) =>
      artistToUpdate.id === id ? artistToUpdate : artist,
    );
    return artistToUpdate;
  }

  public async updateTrack(id: string, track: TrackInput): Promise<Track> {
    const trackToUpdate: Track = this.db.tracks.find(
      (track) => track.id === id,
    );
    if (!trackToUpdate)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    trackToUpdate.name = track.name;
    trackToUpdate.artistId = track.artistId;
    trackToUpdate.albumId = track.albumId;
    trackToUpdate.duration = track.duration;
    this.db.tracks = this.db.tracks.map((track) =>
      trackToUpdate.id === id ? trackToUpdate : track,
    );
    return trackToUpdate;
  }

  public async updateAlbum(id: string, album: AlbumInput): Promise<Album> {
    const albumToUpdate: Album = this.db.albums.find(
      (album) => album.id === id,
    );
    if (!albumToUpdate)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    albumToUpdate.name = album.name;
    albumToUpdate.year = album.year;
    albumToUpdate.artistId = album.artistId;
    this.db.albums = this.db.albums.map((album) =>
      albumToUpdate.id === id ? albumToUpdate : album,
    );
    return albumToUpdate;
  }

  public async deleteUser(id: string): Promise<boolean> {
    const user: User = this.db.users.find((user) => user.id === id);
    if (!user) return false;
    this.db.users = this.db.users.filter((u) => u.id !== id);
    return true;
  }

  public async deleteArtist(id: string): Promise<boolean> {
    const artist: Artist = this.db.artists.find((artist) => artist.id === id);
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    this.db.artists = this.db.artists.filter((a) => a.id !== id);
    return true;
  }

  public async deleteTrack(id: string): Promise<boolean> {
    const track: Track = this.db.tracks.find((track) => track.id === id);
    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    this.db.tracks = this.db.tracks.filter((t) => t.id !== id);
    return true;
  }

  public async deleteAlbum(id: string): Promise<boolean> {
    const album: Album = this.db.albums.find((album) => album.id === id);
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    this.db.albums = this.db.albums.filter((a) => a.id !== id);
    return true;
  }

  public async addFavoriteTrack(id: string, trackId: string): Promise<boolean> {
    const favorite: Favorites = this.db.favorites;
    if (!favorite)
      throw new HttpException('Favorites not found', HttpStatus.NOT_FOUND);
    favorite.tracks = { ...favorite.tracks, [trackId]: id };
    this.db.favorites = favorite;
    return true;
  }

  public async addFavoriteAlbum(id: string, albumId: string): Promise<boolean> {
    const favorite: Favorites = this.db.favorites;
    if (!favorite)
      throw new HttpException('Favorites not found', HttpStatus.NOT_FOUND);
    favorite.albums = { ...favorite.albums, [albumId]: id };
    this.db.favorites = favorite;
    return true;
  }

  public async addFavoriteArtist(
    id: string,
    artistId: string,
  ): Promise<boolean> {
    const favorite: Favorites = this.db.favorites;
    if (!favorite)
      throw new HttpException('Favorites not found', HttpStatus.NOT_FOUND);
    favorite.artists = { ...favorite.artists, [artistId]: id };
    this.db.favorites = favorite;
    return true;
  }

  public async deleteFavoriteArtist(
    id: string,
    artistId: string,
  ): Promise<boolean> {
    const favorite: Favorites = this.db.favorites;
    if (!favorite)
      throw new HttpException('Favorites not found', HttpStatus.NOT_FOUND);
    favorite.artists = { ...favorite.artists };
    const artist = favorite.artists[artistId];
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    delete favorite.artists[artistId];
    favorite.artists = { ...favorite.artists };
    this.db.favorites = favorite;
    return true;
  }

  public async deleteFavoriteAlbum(
    id: string,
    albumId: string,
  ): Promise<boolean> {
    const favorite: Favorites = this.db.favorites;
    if (!favorite)
      throw new HttpException('Favorites not found', HttpStatus.NOT_FOUND);
    favorite.albums = { ...favorite.albums };
    const album = favorite.albums[albumId];
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    delete favorite.albums[albumId];
    favorite.albums = { ...favorite.albums };
    this.db.favorites = favorite;
    return true;
  }

  public async deleteFavoriteTrack(
    id: string,
    trackId: string,
  ): Promise<boolean> {
    const favorite: Favorites = this.db.favorites;
    if (!favorite)
      throw new HttpException('Favorites not found', HttpStatus.NOT_FOUND);
    favorite.tracks = { ...favorite.tracks };
    const track = favorite.tracks[trackId];
    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    delete favorite.tracks[trackId];
    favorite.tracks = { ...favorite.tracks };
    this.db.favorites = favorite;
    return true;
  }
}

export const db = new Database();
