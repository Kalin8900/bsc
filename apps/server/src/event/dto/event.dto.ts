import { EventEntity } from '@joinus/domain';
import { PointDto } from '@joinus/server/core';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';

import { UserDto } from '../../user/dto/user.dto';

export class EventDto implements EventEntity {
  @IsUUID('4')
  @ApiProperty({ example: 'uuid' })
  uuid!: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: '2020-01-01T00:00:00.000Z' })
  createdAt!: Date;

  @Type(() => UserDto)
  @ValidateNested()
  @IsOptional()
  @ApiProperty({ type: UserDto })
  author!: UserDto;

  @IsString()
  @MinLength(2)
  @ApiProperty({ example: 'name' })
  name!: string;

  @ValidateNested()
  @Type(() => PointDto)
  @ApiProperty({ type: PointDto })
  location!: PointDto;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({ example: '2020-01-01T00:00:00.000Z' })
  startDate!: Date | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'description' })
  description!: string | null;
}
