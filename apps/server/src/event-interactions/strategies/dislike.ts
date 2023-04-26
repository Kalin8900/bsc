import { InteractionAlreadyExistsException, InteractionQueryException } from '@joinus/server/base';
import { NeoArrayResult, NeoResult } from '@joinus/server/core';
import { Connection, node, relation } from 'cypher-query-builder';

import { EventNode, EventNodeSchema } from '../../event-recommendations/event.neo4j';
import { UserNodeSchema } from '../../user-recommendations';
import { DislikesRelation, DislikesRelationSchema } from '../event-interactions.neo4j';
import { Interaction, RelationParams } from './interaction';

export class Dislike implements Interaction<DislikesRelation, EventNode> {
  constructor(private readonly neo4j: Connection) {}

  public async do(uuid: string, eventUuid: string, params?: RelationParams): Promise<DislikesRelation> {
    if (await this.is(uuid, eventUuid, params)) {
      throw new InteractionAlreadyExistsException('Already disliked', [
        `User ${uuid} already disliked event ${eventUuid}`
      ]);
    }

    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .create([
        node('user'),
        relation('out', 'relation', DislikesRelationSchema.label, params?.relation),
        node('event')
      ])
      .raw('SET relation.createdAt = datetime()')
      .return('relation')
      .first()) as NeoResult<{ relation: DislikesRelation }>;

    if (!result) {
      throw new InteractionQueryException('Could not create relation', [
        `User ${uuid} could not dislike event ${eventUuid}`
      ]);
    }

    return result.relation;
  }

  public async undo(uuid: string, eventUuid: string, params?: RelationParams): Promise<EventNode> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .match([node('user'), relation('out', 'relation', DislikesRelationSchema.label, params?.relation), node('event')])
      .delete('relation')
      .return('event')
      .first()) as NeoResult<{ event: EventNode }>;

    if (!result) {
      throw new InteractionQueryException('Could not delete relation', [
        `User ${uuid} could not undislike event ${eventUuid}`
      ]);
    }

    return result.event;
  }

  public async is(uuid: string, eventUuid: string, params?: RelationParams): Promise<boolean> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .match([node('user'), relation('out', 'relation', DislikesRelationSchema.label, params?.relation), node('event')])
      .return('relation')
      .first()) as NeoResult<{ relation: DislikesRelation }>;

    return !!result;
  }

  public async get(uuid: string): Promise<EventNode[]> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .match([
        node('user'),
        relation('out', 'relation', DislikesRelationSchema.label),
        node('event', EventNodeSchema.label)
      ])
      .return('event')
      .run()) as NeoArrayResult<{ event: EventNode }>;

    return result.map((record) => record.event);
  }
}
