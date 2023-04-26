import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

import { LikesRelation, LikesRelationSchema } from '../event-interactions.neo4j';

export class LikesRelationDto implements LikesRelation {
  @IsString()
  @ApiProperty({ example: LikesRelationSchema.label })
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
