import { InteractionAlreadyExistsException, InteractionQueryException } from '@joinus/server/base';
import { NeoArrayResult, NeoResult } from '@joinus/server/core';
import { Connection, node, relation } from 'cypher-query-builder';

import { EventNode, EventNodeSchema } from '../../event-recommendations/event.neo4j';
import { UserNode, UserNodeSchema } from '../../user-recommendations';
import { AttendingRelation, AttendingRelationSchema } from '../event-interactions.neo4j';
import { Interaction, RelationParams } from './interaction';

export class Attend implements Interaction<AttendingRelation, EventNode> {
  constructor(private readonly neo4j: Connection) {}

  public async do(uuid: string, eventUuid: string, params?: RelationParams): Promise<AttendingRelation> {
    if (await this.is(uuid, eventUuid, params)) {
      throw new InteractionAlreadyExistsException('Already attending', [
        `User ${uuid} already attending event ${eventUuid}`
      ]);
    }

    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .create([
        node('user'),
        relation('out', 'relation', AttendingRelationSchema.label, params?.relation),
        node('event')
      ])
      .raw('SET relation.createdAt = datetime()')
      .return('relation')
      .first()) as NeoResult<{ relation: AttendingRelation }>;

    if (!result) {
      throw new InteractionQueryException('Could not create relation', [
        `User ${uuid} could not attend event ${eventUuid}`
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
        relation('out', 'relation', AttendingRelationSchema.label, params?.relation),
        node('event')
      ])
      .delete('relation')
      .return('event')
      .first()) as NeoResult<{ event: EventNode }>;

    if (!result) {
      throw new InteractionQueryException('Could not delete relation', [
        `User ${uuid} could not unattend event ${eventUuid}`
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
        relation('out', 'relation', AttendingRelationSchema.label, params?.relation),
        node('event')
      ])
      .return('relation')
      .first()) as NeoResult<{ relation: AttendingRelation }>;

    return !!result;
  }

  public async get(uuid: string): Promise<EventNode[]> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .match([
        node('user'),
        relation('out', 'relation', AttendingRelationSchema.label),
        node('event', EventNodeSchema.label)
      ])
      .return('event')
      .run()) as NeoArrayResult<{ event: EventNode }>;

    return result.map((r) => r.event);
  }

  public async getAttenders(eventUuid: string): Promise<UserNode[]> {
    const result = (await this.neo4j
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .match([
        node('user', UserNodeSchema.label),
        relation('out', 'relation', AttendingRelationSchema.label),
        node('event')
      ])
      .return('user')
      .run()) as NeoArrayResult<{ user: UserNode }>;

    return result.map((r) => r.user);
  }
}
