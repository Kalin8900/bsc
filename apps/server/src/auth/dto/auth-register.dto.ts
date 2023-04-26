import { PasswordDto } from '@joinus/server/core';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { UserCreateDto } from '../../user/dto/user-create.dto';

export class AuthRegisterDto extends PasswordDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UserCreateDto)
  @ApiProperty({})
  user!: UserCreateDto;
}
