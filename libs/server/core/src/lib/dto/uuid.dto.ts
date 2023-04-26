import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UuidDto {
  @IsUUID('4')
  @ApiProperty({ example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6' })
  uuid!: string;
}
