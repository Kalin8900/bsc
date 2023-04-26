import { CategoryNotFoundException } from '@joinus/server/base';
import { ArgumentMetadata, Injectable, mixin, PipeTransform } from '@nestjs/common';

import { CategoryService } from '../category.service';

export function CategoryExistsFactory<T = any>(extractor?: (dto: T) => string) {
  @Injectable()
  class CategoryExistsClass implements PipeTransform {
    constructor(private readonly categoryService: CategoryService) {}

    async transform(value: any, _metadata: ArgumentMetadata) {
      try {
        await this.categoryService.getOne(extractor ? extractor(value) : value.uuid);

        return value;
      } catch (e) {
        throw new CategoryNotFoundException([`Category ${value.uuid} does not exist`]);
      }
    }
  }

  return mixin(CategoryExistsClass);
}

export class CategoryExistsPipe extends CategoryExistsFactory() {}
