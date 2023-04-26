import { User } from '@joinus/domain';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class UserCreateDto implements User {
  @IsEmail()
  @ApiProperty({ example: 'michal@kalinowski.one' })
  @Transform(({ value }) => value.toLowerCase())
  email!: string;

  @IsPhoneNumber()
  @ApiProperty({ example: '+48123456789' })
  phone!: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'Michał' })
  firstName!: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'Kalinowski' })
  lastName!: string;
}
