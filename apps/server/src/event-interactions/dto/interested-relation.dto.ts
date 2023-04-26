import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

import { InterestedRelation, InterestedRelationSchema } from '../event-interactions.neo4j';

export class InterestedRelationDto implements InterestedRelation {
  @IsString()
  @ApiProperty({ example: InterestedRelationSchema.label })
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
