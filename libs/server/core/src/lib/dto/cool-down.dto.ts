import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, Min } from 'class-validator';

export interface CoolDown {
  datetime: Date;
  remaining: number;
}

export class CoolDownDto {
  @IsDate()
  @ApiProperty({ example: new Date() })
  datetime!: Date;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 43, description: 'Remaining time in milliseconds' })
  remaining!: number;
}
