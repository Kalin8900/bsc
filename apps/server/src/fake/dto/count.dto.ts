import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class CountDto {
  @Min(0)
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  count!: number;
}
