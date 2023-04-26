import { UuidDto } from '@joinus/server/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CategorizationDto extends UuidDto {
  @IsUUID('4')
  @ApiProperty({ example: 'e0b9b9a0-5d5c-11eb-ae93-0242ac130002' })
  categoryUuid!: string;
}
