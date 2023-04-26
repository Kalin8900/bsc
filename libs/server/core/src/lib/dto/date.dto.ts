import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class DateDto {
  @IsDate()
  @ApiProperty({ example: '2020-01-01T00:00:00.000Z' })
  date!: Date;
}
