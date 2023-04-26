import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { DeleteResult, ObjectLiteral } from 'typeorm';

export class DeleteResultDto implements DeleteResult {
  @IsOptional()
  raw: any;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  affected?: number | undefined;

  @IsOptional()
  generatedMaps!: ObjectLiteral[];
}
