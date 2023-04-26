import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

import { EventCategoryRelation, EventCategoryRelationSchema } from '../categorization.neo4j';

export class EventCategoryRelationDto implements EventCategoryRelation {
  @IsString()
  @ApiProperty({ example: EventCategoryRelationSchema.label })
  label!: string;

  @IsObject()
  @ApiProperty({ example: {} })
  properties!: {};

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
