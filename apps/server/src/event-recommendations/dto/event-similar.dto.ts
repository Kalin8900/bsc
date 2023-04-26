import { SimilarEvent } from '@joinus/domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class SimilarEventDto implements SimilarEvent {
  @IsUUID('4')
  @ApiProperty({ example: 'e0b9b9a0-5d5c-4d3d-8c68-5eaf8b0f3e0f' })
  uuid!: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  @ApiProperty({ example: 0.534 })
  catSimilarity!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @ApiProperty({ example: 0.532 })
  tagsSimilarity!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @ApiProperty({ example: 0.654 })
  distancePoints!: number;

  @IsNumber()
  @Min(0)
  @Max(3)
  @ApiProperty({ example: 1.234 })
  totalSimilarity!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1234 })
  distance!: number;
}
