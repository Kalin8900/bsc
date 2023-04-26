import { PageDto, PointDto } from '@joinus/server/core';
import { IntersectionType } from '@nestjs/swagger';

export class RecommendationsDto extends IntersectionType(PointDto, PageDto) {}
