import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthTokenDto {
  @IsString()
  @ApiProperty({ example: 'token' })
  accessToken!: string;
}
