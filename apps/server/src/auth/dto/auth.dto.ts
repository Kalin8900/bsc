import { AuthEntity } from '@joinus/domain';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';

import { RoleDto } from '../../role';
import { UserDto } from '../../user/dto/user.dto';

export class AuthDto implements AuthEntity {
  @IsString()
  @ApiProperty({ example: 'uuid' })
  uuid!: string;

  @ValidateNested()
  @Type(() => UserDto)
  @IsOptional()
  @ApiProperty({})
  user?: UserDto;

  @ValidateNested()
  @Type(() => RoleDto)
  @IsOptional()
  @ApiProperty()
  role?: RoleDto;

  @IsBoolean()
  @ApiProperty({ example: false })
  isEmailVerified!: boolean;

  @IsBoolean()
  @ApiProperty({ example: true })
  isPhoneVerified!: boolean;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: '2020-01-01T00:00:00.000Z' })
  createdAt!: Date;
}
