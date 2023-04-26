import { RoleEntity } from '@joinus/domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RoleDto implements RoleEntity {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id!: number;

  @IsString()
  @ApiProperty({ example: 'user' })
  name!: string;
}
