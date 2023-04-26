import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EntityIdDto {
  @IsString()
  @ApiProperty({ example: '01GNTASHADS3X6FXBF81YR53ZT' })
  entityId!: string;
}
