import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class PhoneDto {
  @IsPhoneNumber()
  @ApiProperty({ example: '+48 123 456 789' })
  phone!: string;
}
