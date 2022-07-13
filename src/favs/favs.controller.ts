import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Post('track/:id')
  addTrackToFav(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addTrackToFav(id);
  }

  @Post('artist/:id')
  addArtistToFav(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addArtistToFav(id);
  }

  @Post('album/:id')
  addAlbumToFav(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addAlbumToFav(id);
  }

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrackFromFav(@Param('id') id: string) {
    return this.favsService.removeTrackFromFav(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtistFromFav(@Param('id') id: string) {
    return this.favsService.removeArtistFromFav(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbumFromFav(@Param('id') id: string) {
    return this.favsService.removeAlbumFromFav(id);
  }
}
