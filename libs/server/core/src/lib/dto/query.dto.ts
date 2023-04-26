import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class QueryDto {
  @IsString()
  @ApiProperty({ example: 'Michał' })
  public query!: string;
}
