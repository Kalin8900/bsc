import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PageDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ required: false, default: 0 })
  @Type(() => Number)
  skip?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ required: false, default: 10 })
  @Type(() => Number)
  take?: number;
}
