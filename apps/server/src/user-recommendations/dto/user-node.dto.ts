import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { UserNode } from '../user.neo4j';
import { UserNodePropsDto } from './user-node-props.dto';

export class UserNodeDto implements UserNode {
  @IsString()
  @ApiProperty({ example: 0 })
  identity!: string;

  @IsString({ each: true })
  @ApiProperty({ example: ['User'] })
  labels!: string[];

  @Type(() => UserNodePropsDto)
  @ValidateNested()
  @ApiProperty({ type: UserNodePropsDto })
  properties!: UserNodePropsDto;
}
