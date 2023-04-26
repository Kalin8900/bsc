import { CategoryEntity } from '@joinus/domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class CategoryDto implements CategoryEntity {
  @IsString()
  @ApiProperty({ example: 'name' })
  name!: string;

  @IsString()
  @ApiProperty({ example: 'description' })
  description!: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/image.png' })
  imageUrl!: string | null;

  @IsUUID('4')
  @ApiProperty({ example: 'e0b9b9a0-1d8a-4b0c-8b9d-9b2a7b4dcb6d' })
  uuid!: string;
}
