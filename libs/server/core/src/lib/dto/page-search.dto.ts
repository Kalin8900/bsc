import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PageDto } from './page.dto';

export class PageSearchDto extends PageDto {
  @IsString()
  @ApiProperty({ example: 'Michał' })
  query!: string;
}
