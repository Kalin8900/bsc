import { Category } from '@joinus/domain';
import { OmitType } from '@nestjs/swagger';

import { CategoryDto } from './category.dto';

export class CategoryCreateDto extends OmitType(CategoryDto, ['uuid']) implements Category {}
