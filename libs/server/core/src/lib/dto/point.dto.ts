import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

import type { LongLat } from '../validators';
import { IsLongLat } from '../validators';

export interface Point {
  type: 'Point';
  coordinates: LongLat;
}

export const isPoint = (value: any): value is Point => {
  return value && value.type === 'Point' && value.coordinates && value.coordinates.length === 2;
};

export class PointDto {
  @IsString()
  @Matches(/Point/)
  @ApiProperty({ example: 'Point' })
  type!: 'Point';

  @IsLongLat()
  @ApiProperty({ example: [52.2356, 21.01037], type: [Number, Number] })
  @Type(() => Number)
  coordinates!: LongLat;
}
