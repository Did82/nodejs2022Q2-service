import { v4 as uuidv4 } from 'uuid';

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

export class Database {
  private db: {
    users: User[];
    artists: Artist[];
    tracks: Track[];
    albums: Album[];
    favorites: Favorites;
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

  public getUsers(): User[] {
    return this.db.users;
  }

  public getArtists(): Artist[] {
    return this.db.artists;
  }

  public getTracks(): Track[] {
    return this.db.tracks;
  }

  public getAlbums(): Album[] {
    return this.db.albums;
  }

  public getFavorites(): FavoritesRepsonse {
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

  public addUser(user: CreateUserDto): User {
    const id = uuidv4();
    const createdAt = Date.now();
    const updatedAt = createdAt;
    const version = 0;
    const newUser = {
      id,
      createdAt,
      updatedAt,
      version,
      ...user,
    };
    this.db.users.push(newUser);
    return newUser;
  }

  public addArtist(artist: ArtistInput): Artist {
    const id = uuidv4();
    const newArtist = { id, ...artist };
    this.db.artists.push(newArtist);
    return newArtist;
  }

  public addTrack(track: TrackInput): Track {
    const id = uuidv4();
    const newTrack = { id, ...track };
    this.db.tracks.push(newTrack);
    return newTrack;
  }

  public addAlbum(album: AlbumInput): Album {
    const id = uuidv4();
    const newAlbum = { id, ...album };
    this.db.albums.push(newAlbum);
    return newAlbum;
  }

  public addFavorite(favorite: Favorites): Favorites {
    this.db.favorites = { ...this.db.favorites, ...favorite };
    return this.db.favorites;
  }

  public getUserById(id: string): User {
    const user: User = this.db.users.find((user) => user.id === id);
    if (!user) throw new Error('User not found');
    return user;
  }

  public getArtistById(id: string): Artist {
    const artist: Artist = this.db.artists.find((artist) => artist.id === id);
    if (!artist) throw new Error('Artist not found');
    return artist;
  }

  public getTrackById(id: string): Track {
    const track: Track = this.db.tracks.find((track) => track.id === id);
    if (!track) throw new Error('Track not found');
    return track;
  }

  public getAlbumById(id: string): Album {
    const album: Album = this.db.albums.find((album) => album.id === id);
    if (!album) throw new Error('Album not found');
    return album;
  }

  public updateUser(id: string, updatePassword: UpdatePasswordDto): User {
    const user: User = this.db.users.find((user) => user.id === id);
    if (!user) throw new Error('User not found');
    if (user.password !== updatePassword.oldPassword)
      throw new Error('Wrong password');
    user.password = updatePassword.newPassword;
    user.updatedAt = Date.now();
    user.version += 1;
    this.db.users = this.db.users.map((u) => (user.id === id ? user : u));
    return user;
  }

  public updateArtist(id: string, artist: ArtistInput): Artist {
    const artistToUpdate: Artist = this.db.artists.find(
      (artist) => artist.id === id,
    );
    if (!artistToUpdate) throw new Error('Artist not found');
    artistToUpdate.name = artist.name;
    artistToUpdate.grammy = artist.grammy;
    this.db.artists = this.db.artists.map((artist) =>
      artistToUpdate.id === id ? artistToUpdate : artist,
    );
    return artistToUpdate;
  }

  public updateTrack(id: string, track: TrackInput): Track {
    const trackToUpdate: Track = this.db.tracks.find(
      (track) => track.id === id,
    );
    if (!trackToUpdate) throw new Error('Track not found');
    trackToUpdate.name = track.name;
    trackToUpdate.artistId = track.artistId;
    trackToUpdate.albumId = track.albumId;
    trackToUpdate.duration = track.duration;
    this.db.tracks = this.db.tracks.map((track) =>
      trackToUpdate.id === id ? trackToUpdate : track,
    );
    return trackToUpdate;
  }

  public updateAlbum(id: string, album: AlbumInput): Album {
    const albumToUpdate: Album = this.db.albums.find(
      (album) => album.id === id,
    );
    if (!albumToUpdate) throw new Error('Album not found');
    albumToUpdate.name = album.name;
    albumToUpdate.year = album.year;
    albumToUpdate.artistId = album.artistId;
    this.db.albums = this.db.albums.map((album) =>
      albumToUpdate.id === id ? albumToUpdate : album,
    );
    return albumToUpdate;
  }

  public deleteUser(id: string): boolean {
    const user: User = this.db.users.find((user) => user.id === id);
    if (!user) throw new Error('User not found');
    this.db.users = this.db.users.filter((u) => u.id !== id);
    return true;
  }

  public deleteArtist(id: string): boolean {
    const artist: Artist = this.db.artists.find((artist) => artist.id === id);
    if (!artist) throw new Error('Artist not found');
    this.db.artists = this.db.artists.filter((a) => a.id !== id);
    return true;
  }

  public deleteTrack(id: string): boolean {
    const track: Track = this.db.tracks.find((track) => track.id === id);
    if (!track) throw new Error('Track not found');
    this.db.tracks = this.db.tracks.filter((t) => t.id !== id);
    return true;
  }

  public deleteAlbum(id: string): boolean {
    const album: Album = this.db.albums.find((album) => album.id === id);
    if (!album) throw new Error('Album not found');
    this.db.albums = this.db.albums.filter((a) => a.id !== id);
    return true;
  }

  public addFavoriteTrack(id: string, trackId: string): Favorites {
    const favorite: Favorites = this.db.favorites;
    if (!favorite) throw new Error('Favorites not found');
    favorite.tracks = { ...favorite.tracks, [trackId]: id };
    this.db.favorites = favorite;
    return favorite;
  }

  public addFavoriteAlbum(id: string, albumId: string): Favorites {
    const favorite: Favorites = this.db.favorites;
    if (!favorite) throw new Error('Favorites not found');
    favorite.albums = { ...favorite.albums, [albumId]: id };
    this.db.favorites = favorite;
    return favorite;
  }

  public addFavoriteArtist(id: string, artistId: string): Favorites {
    const favorite: Favorites = this.db.favorites;
    if (!favorite) throw new Error('Favorites not found');
    favorite.artists = { ...favorite.artists, [artistId]: id };
    this.db.favorites = favorite;
    return favorite;
  }

  public deleteFavoriteArtist(id: string, artistId: string): Favorites {
    const favorite: Favorites = this.db.favorites;
    if (!favorite) throw new Error('Favorites not found');
    favorite.artists = { ...favorite.artists };
    const artist = favorite.artists[artistId];
    if (!artist) throw new Error('Artist not found');
    delete favorite.artists[artistId];
    favorite.artists = { ...favorite.artists };
    this.db.favorites = favorite;
    return favorite;
  }

  public deleteFavoriteAlbum(id: string, albumId: string): Favorites {
    const favorite: Favorites = this.db.favorites;
    if (!favorite) throw new Error('Favorites not found');
    favorite.albums = { ...favorite.albums };
    const album = favorite.albums[albumId];
    if (!album) throw new Error('Album not found');
    delete favorite.albums[albumId];
    favorite.albums = { ...favorite.albums };
    this.db.favorites = favorite;
    return favorite;
  }

  public deleteFavoriteTrack(id: string, trackId: string): Favorites {
    const favorite: Favorites = this.db.favorites;
    if (!favorite) throw new Error('Favorites not found');
    favorite.tracks = { ...favorite.tracks };
    const track = favorite.tracks[trackId];
    if (!track) throw new Error('Track not found');
    delete favorite.tracks[trackId];
    favorite.tracks = { ...favorite.tracks };
    this.db.favorites = favorite;
    return favorite;
  }
}
