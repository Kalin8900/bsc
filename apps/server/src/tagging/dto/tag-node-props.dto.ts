import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsString } from 'class-validator';

import { TagNodeProps } from '../tagging.neo4j';

export class TagNodePropsDto implements TagNodeProps {
  @IsString()
  @IsAlphanumeric()
  @ApiProperty({ example: 'name' })
  name!: string;
}
