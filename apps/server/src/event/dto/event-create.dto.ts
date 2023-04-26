import { Event } from '@joinus/domain';
import { IsFutureDate, PointDto } from '@joinus/server/core';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

export class EventCreateDto implements Event {
  @IsString()
  @MinLength(2)
  @ApiProperty({ example: 'name' })
  name!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'description' })
  description!: string | null;

  @IsFutureDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({ example: '2020-01-01T00:00:00.000Z' })
  startDate!: Date | null;

  @ValidateNested()
  @Type(() => PointDto)
  @IsNotEmpty()
  @ApiProperty({ type: PointDto })
  location!: PointDto;
}
