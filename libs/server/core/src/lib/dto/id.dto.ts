import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class IdDTO {
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1 })
  id!: number;
}
