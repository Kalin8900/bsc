import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UserDto } from '../../user';
import { AuthTokenDto } from './auth-token.dto';

export class AuthLoginDto extends AuthTokenDto {
  @ApiProperty({ type: UserDto })
  @ValidateNested()
  @Type(() => UserDto)
  user!: UserDto;
}
