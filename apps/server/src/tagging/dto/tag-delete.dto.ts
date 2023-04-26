import { UuidDto } from '@joinus/server/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsString } from 'class-validator';

export class TagDeleteDto extends UuidDto {
  @IsString()
  @IsAlphanumeric()
  @ApiProperty({ example: 'name' })
  name!: string;
}
