import { InteractionAlreadyExistsException, InteractionQueryException } from '@joinus/server/base';
import { NeoArrayResult, NeoResult } from '@joinus/server/core';
import { Connection, node, relation } from 'cypher-query-builder';

import { EventNode, EventNodeSchema } from '../../event-recommendations/event.neo4j';
import { UserNodeSchema } from '../../user-recommendations';
import { RatedRelation, RatedRelationProperties, RatedRelationSchema } from '../event-interactions.neo4j';
import { Interaction, RelationParams } from './interaction';

export class Rate implements Interaction<RatedRelation, EventNode> {
  constructor(private readonly neo4j: Connection) {}

  public async do(
    uuid: string,
    eventUuid: string,
    params?: RelationParams<RatedRelationProperties>
  ): Promise<RatedRelation> {
    if (await this.is(uuid, eventUuid, params)) {
      throw new InteractionAlreadyExistsException('Already rated', [`User ${uuid} already rated event ${eventUuid}`]);
    }

    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .create([node('user'), relation('out', 'relation', RatedRelationSchema.label, params?.relation), node('event')])
      .raw('SET relation.createdAt = datetime()')
      .return('relation')
      .first()) as NeoResult<{ relation: RatedRelation }>;

    if (!result) {
      throw new InteractionQueryException('Could not create relation', [
        `User ${uuid} could not be rated in event ${eventUuid}`
      ]);
    }

    return result.relation;
  }

  public async undo(
    uuid: string,
    eventUuid: string,
    params?: RelationParams<RatedRelationProperties>
  ): Promise<EventNode> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .match([node('user'), relation('out', 'relation', RatedRelationSchema.label, params?.relation), node('event')])
      .delete('relation')
      .return('event')
      .first()) as NeoResult<{ event: EventNode }>;

    if (!result) {
      throw new InteractionQueryException('Could not delete relation', [
        `User ${uuid} could not be unrated in event ${eventUuid}`
      ]);
    }

    return result.event;
  }

  public async is(uuid: string, eventUuid: string, params?: RelationParams<RatedRelationProperties>): Promise<boolean> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .match([node('user'), relation('out', 'relation', RatedRelationSchema.label, params?.relation), node('event')])
      .return('relation')
      .first()) as NeoResult<{ relation: RatedRelation }>;

    return !!result;
  }

  public async get(uuid: string): Promise<EventNode[]> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .match([
        node('user'),
        relation('out', 'relation', RatedRelationSchema.label),
        node('event', EventNodeSchema.label)
      ])
      .return('event')
      .run()) as NeoArrayResult<{ event: EventNode }>;

    return result.map((r) => r.event);
  }

  public async getAvgRating(eventUuid: string): Promise<number> {
    const result = (await this.neo4j
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .match([node('event'), relation('in', 'relation', RatedRelationSchema.label), node('user', UserNodeSchema.label)])
      .return('avg(relation.rating) as avgRating')
      .first()) as NeoResult<{ avgRating: number }>;

    if (!result) {
      throw new InteractionQueryException('Could not get avg rating', [
        `Could not get avg rating for event ${eventUuid}`
      ]);
    }

    return result.avgRating;
  }

  public async getRating(uuid: string, eventUuid: string): Promise<number> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .match([node('user'), relation('out', 'relation', RatedRelationSchema.label), node('event')])
      .return('relation.rating as rating')
      .first()) as NeoResult<{ rating: number }>;

    if (!result) {
      throw new InteractionQueryException('Could not get rating', [
        `Could not get rating for user ${uuid} in event ${eventUuid}`
      ]);
    }

    return result.rating;
  }
}
