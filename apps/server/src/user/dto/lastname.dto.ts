import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, MinLength } from 'class-validator';

export class LastsNameDto {
  @IsAlpha()
  @MinLength(2)
  @ApiProperty({ example: 'Kalinowski' })
  lastName!: string;
}
