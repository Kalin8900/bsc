import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class RatingDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 5 })
  rating!: number;
}
