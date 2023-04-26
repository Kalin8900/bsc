import { UserEntity } from '@joinus/domain';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEmail, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

export class UserDto implements UserEntity {
  @IsUUID('4')
  @ApiProperty({ example: 'uuid' })
  uuid!: string;

  @IsEmail()
  @ApiProperty({ example: 'michal@kalinowski.one' })
  @Transform(({ value }) => value.toLowerCase())
  email!: string;

  @IsPhoneNumber()
  @ApiProperty({ example: '+48123456789' })
  phone!: string;

  @IsString()
  @ApiProperty({ example: 'Michał' })
  firstName!: string;

  @IsString()
  @ApiProperty({ example: 'Kalinowski' })
  lastName!: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: '2020-01-01T00:00:00.000Z' })
  createdAt!: Date;
}
