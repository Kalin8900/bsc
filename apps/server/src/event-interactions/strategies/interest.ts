import { InteractionAlreadyExistsException, InteractionQueryException } from '@joinus/server/base';
import { NeoArrayResult, NeoResult } from '@joinus/server/core';
import { Connection, node, relation } from 'cypher-query-builder';

import { EventNode, EventNodeSchema } from '../../event-recommendations/event.neo4j';
import { UserNode, UserNodeSchema } from '../../user-recommendations';
import { InterestedRelation, InterestedRelationSchema } from '../event-interactions.neo4j';
import { Interaction, RelationParams } from './interaction';

export class Interest implements Interaction<InterestedRelation, EventNode> {
  constructor(private readonly neo4j: Connection) {}

  public async do(uuid: string, eventUuid: string, params?: RelationParams): Promise<InterestedRelation> {
    if (await this.is(uuid, eventUuid, params)) {
      throw new InteractionAlreadyExistsException('Already interested', [
        `User ${uuid} already interested in event ${eventUuid}`
      ]);
    }

    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .create([
        node('user'),
        relation('out', 'relation', InterestedRelationSchema.label, params?.relation),
        node('event')
      ])
      .raw('SET relation.createdAt = datetime()')
      .return('relation')
      .first()) as NeoResult<{ relation: InterestedRelation }>;

    if (!result) {
      throw new InteractionQueryException('Could not create relation', [
        `User ${uuid} could not be interested in event ${eventUuid}`
      ]);
    }

    return result.relation;
  }

  public async undo(uuid: string, eventUuid: string, params?: RelationParams): Promise<EventNode> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .match([
        node('user'),
        relation('out', 'relation', InterestedRelationSchema.label, params?.relation),
        node('event')
      ])
      .delete('relation')
      .return('event')
      .first()) as NeoResult<{ event: EventNode }>;

    if (!result) {
      throw new InteractionQueryException('Could not delete relation', [
        `User ${uuid} could not be uninterested in event ${eventUuid}`
      ]);
    }

    return result.event;
  }

  public async is(uuid: string, eventUuid: string, params?: RelationParams): Promise<boolean> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .match([
        node('user'),
        relation('out', 'relation', InterestedRelationSchema.label, params?.relation),
        node('event')
      ])
      .return('relation')
      .first()) as NeoResult<{ relation: InterestedRelation }>;

    return !!result;
  }

  public async get(uuid: string): Promise<EventNode[]> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .match([
        node('user'),
        relation('out', 'relation', InterestedRelationSchema.label),
        node('event', EventNodeSchema.label)
      ])
      .return('event')
      .run()) as NeoArrayResult<{ event: EventNode }>;

    return result.map(({ event }) => event);
  }

  public async getInterested(eventUuid: string): Promise<UserNode[]> {
    const result = (await this.neo4j
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .match([
        node('user', UserNodeSchema.label),
        relation('out', 'relation', InterestedRelationSchema.label),
        node('event')
      ])
      .return('user')
      .run()) as NeoArrayResult<{ user: UserNode }>;

    return result.map(({ user }) => user);
  }
}
