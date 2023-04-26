import { EntityIdDto } from '@joinus/server/core';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class EventSearchDto {
  @IsUUID('4')
  @ApiProperty({ example: 'e0b9b9a0-5dfe-4bfa-8c90-86aec0f7e3b7' })
  uuid!: string;

  @IsString()
  @ApiProperty({ example: 'Event name' })
  name!: string;

  @IsString()
  @ApiProperty({ example: 'Event description' })
  description!: string;
}

export class EventSearchEntityDto extends IntersectionType(EventSearchDto, EntityIdDto) {}
