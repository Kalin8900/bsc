import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { ObjectLiteral, UpdateResult } from 'typeorm';

export class UpdateResultDto implements UpdateResult {
  @IsOptional()
  raw: any;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  affected?: number | undefined;

  @IsOptional()
  generatedMaps!: ObjectLiteral[];
}
