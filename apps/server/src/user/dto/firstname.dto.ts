import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, MinLength } from 'class-validator';

export class FirstNameDto {
  @IsAlpha()
  @MinLength(2)
  @ApiProperty({ example: 'Michał' })
  firstName!: string;
}
