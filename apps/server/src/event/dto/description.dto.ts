import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DescriptionDto {
  @IsString()
  @ApiProperty({ example: 'description' })
  description!: string;
}
