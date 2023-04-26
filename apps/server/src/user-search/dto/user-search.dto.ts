import { EntityIdDto } from '@joinus/server/core';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

export class UserSearchDto {
  @IsUUID('4')
  @ApiProperty({ example: 'e0b9b9a0-5dfe-4bfa-8c90-86aec0f7e3b7' })
  uuid!: string;

  @IsString()
  @ApiProperty({ example: 'Michał' })
  firstName!: string;

  @IsString()
  @ApiProperty({ example: 'Kalinowski' })
  lastName!: string;

  @IsEmail()
  @ApiProperty({ example: 'michal@kalinowski.one' })
  email!: string;

  @IsPhoneNumber()
  @ApiProperty({ example: '+48123456789' })
  phone!: string;
}

export class UserSearchEntityDto extends IntersectionType(UserSearchDto, EntityIdDto) {}
