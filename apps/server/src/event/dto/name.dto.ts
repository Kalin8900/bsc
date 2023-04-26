import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NameDto {
  @IsString()
  @ApiProperty({ example: 'name' })
  name!: string;
}
