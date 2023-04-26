import { CategoryNotFoundException } from '@joinus/server/base';
import { InjectNeo4j, NeoResult } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { Connection } from 'cypher-query-builder';

import { CategoryNode, CategoryNodeSchema } from './category.neo4j';
import { CategoryNodePropsDto } from './dto';

@Injectable()
export class CategoryNeo4jFacade {
  constructor(
    @InjectNeo4j()
    private readonly neo4j: Connection
  ) {}

  public async create(category: CategoryNodePropsDto): Promise<CategoryNode> {
    const result = (await this.neo4j
      .createNode('category', CategoryNodeSchema.label, category)
      .return('category')
      .first()) as NeoResult<{ category: CategoryNode }>;

    if (!result) {
      throw new CategoryNotFoundException([`Category ${category.uuid} cannot be created`]);
    }

    return result.category;
  }

  public async delete(uuid: string): Promise<CategoryNode> {
    const result = (await this.neo4j
      .matchNode('category', CategoryNodeSchema.label, { uuid })
      .detachDelete('category')
      .return('category')
      .first()) as NeoResult<{ category: CategoryNode }>;

    if (!result) {
      throw new CategoryNotFoundException([`Category ${uuid} cannot be deleted`]);
    }

    return result.category;
  }
}
