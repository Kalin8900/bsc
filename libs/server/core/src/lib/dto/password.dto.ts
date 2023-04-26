import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class PasswordDto {
  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'password' })
  password!: string;
}
