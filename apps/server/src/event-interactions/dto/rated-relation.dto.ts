import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';

import { RatedRelation, RatedRelationProperties, RatedRelationSchema } from '../event-interactions.neo4j';
import { RatingDto } from './rating.dto';

export class RatedRelationPropertiesDto extends RatingDto implements RatedRelationProperties {}

export class RatedRelationDto implements RatedRelation {
  @IsString()
  @ApiProperty({ example: RatedRelationSchema.label })
  label!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => RatedRelationPropertiesDto)
  @ApiProperty({ type: RatedRelationPropertiesDto })
  properties!: RatedRelationPropertiesDto;

  @IsString()
  @ApiProperty({ example: '1' })
  identity!: string;

  @IsString()
  @ApiProperty({ example: '1' })
  start!: string;

  @IsString()
  @ApiProperty({ example: '2' })
  end!: string;
}
