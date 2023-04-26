import { IntersectionType } from '@nestjs/swagger';

import { PageDto } from './page.dto';
import { QueryDto } from './query.dto';

export class PageQueryDto extends IntersectionType(QueryDto, PageDto) {}
