import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsUUID } from 'class-validator';

import { EventNodeProps } from '../event.neo4j';

export class EventNodePropsDto implements EventNodeProps {
  @IsUUID('4')
  @ApiProperty({ example: 'e0b9b9a0-1d8a-4b0c-8b9d-9b2a7b4dcb6d' })
  uuid!: string;

  @IsLatitude()
  @ApiProperty({ example: 37.7749 })
  lat!: number;

  @IsLongitude()
  @ApiProperty({ example: -12.4194 })
  long!: number;
}
