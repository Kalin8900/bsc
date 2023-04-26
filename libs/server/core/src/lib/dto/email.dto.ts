import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @ApiProperty({ example: 'michal@kalinowski.one' })
  @Transform(({ value }) => value.toLowerCase())
  email!: string;
}
