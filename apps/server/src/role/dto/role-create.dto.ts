import { IsString, MinLength } from 'class-validator';

export class RoleCreateDto {
  @IsString()
  @MinLength(2)
  name!: string;
}
