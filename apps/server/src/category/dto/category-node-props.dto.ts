import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { CategoryNodeProps } from '../category.neo4j';

export class CategoryNodePropsDto implements CategoryNodeProps {
  @IsUUID('4')
  @ApiProperty({ example: 'e0b9b9a0-1d8a-4b0c-8b9d-9b2a7b4dcb6d' })
  uuid!: string;
}
