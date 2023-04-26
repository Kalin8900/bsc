import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { TagNode } from '../tagging.neo4j';
import { TagNodePropsDto } from './tag-node-props.dto';

export class TagNodeDto implements TagNode {
  @IsString()
  @ApiProperty({ example: '0' })
  identity!: string;

  @IsString({ each: true })
  @ApiProperty({ example: ['Tag'] })
  labels!: string[];

  @Type(() => TagNodePropsDto)
  @ValidateNested()
  @ApiProperty({ type: TagNodePropsDto })
  properties!: TagNodePropsDto;
}
