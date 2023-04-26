import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { EventNode } from '../event.neo4j';
import { EventNodePropsDto } from './event-node-props.dto';

export class EventNodeDto implements EventNode {
  @IsString()
  @ApiProperty({ example: 0 })
  identity!: string;

  @IsString({ each: true })
  @ApiProperty({ example: ['Event'] })
  labels!: string[];

  @Type(() => EventNodePropsDto)
  @ValidateNested()
  @ApiProperty({ type: EventNodePropsDto })
  properties!: EventNodePropsDto;
}
