import { IsUUID } from 'class-validator';

export class CreateFavDto {
  @IsUUID()
  id: string;
}
