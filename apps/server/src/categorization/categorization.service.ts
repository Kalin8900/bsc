import { InjectNeo4j, NeoResult } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { Connection, node, relation } from 'cypher-query-builder';

import { EventNode } from '../event-recommendations/event.neo4j';
import { EventCategoryRelation, EventCategoryRelationSchema } from './categorization.neo4j';

@Injectable()
export class CategorizationService {
  constructor(
    @InjectNeo4j()
    private readonly neo4j: Connection
  ) {}

  public async setCategory(eventUuid: string, categoryUuid: string): Promise<EventCategoryRelation> {
    if (await this.hasCategory(eventUuid, categoryUuid)) {
      throw new Error('Event already has category'); // FIXME: Create custom exception
    }

    const result = (await this.neo4j
      .matchNode('event', 'Event', { uuid: eventUuid })
      .matchNode('category', 'Category', { uuid: categoryUuid })
      .create([node('event'), relation('out', 'relation', EventCategoryRelationSchema.label, {}), node('category')])
      .raw('SET relation.createdAt = datetime()')
      .return('relation')
      .first()) as NeoResult<{ relation: EventCategoryRelation }>;

    if (!result) {
      throw new Error('Event or category not found'); // FIXME: Create custom exception
    }

    return result.relation;
  }

  public async hasCategory(eventUuid: string, categoryUuid: string): Promise<boolean> {
    const result = (await this.neo4j
      .matchNode('event', 'Event', { uuid: eventUuid })
      .matchNode('category', 'Category', { uuid: categoryUuid })
      .match([node('event'), relation('out', 'relation', EventCategoryRelationSchema.label, {}), node('category')])
      .return('relation')
      .first()) as NeoResult<{ relation: EventCategoryRelation }>;

    return !!result;
  }

  public async removeCategory(eventUuid: string, categoryUuid: string): Promise<EventNode> {
    const result = (await this.neo4j
      .matchNode('event', 'Event', { uuid: eventUuid })
      .matchNode('category', 'Category', { uuid: categoryUuid })
      .match([node('event'), relation('out', 'relation', EventCategoryRelationSchema.label, {}), node('category')])
      .delete('relation')
      .return('event')
      .first()) as NeoResult<{ event: EventNode }>;

    if (!result) {
      throw new Error('Event or category not found'); // FIXME: Create custom exception
    }

    return result.event;
  }
}
