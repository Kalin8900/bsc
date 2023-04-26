import { IsFutureDate } from '@joinus/server/core';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class StartDateDto {
  @IsFutureDate()
  @Type(() => Date)
  @ApiProperty({ example: '2020-01-01T00:00:00.000Z' })
  startDate!: Date;
}
