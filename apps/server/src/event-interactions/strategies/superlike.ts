import {
  InteractionAlreadyExistsException,
  InteractionCoolDownException,
  InteractionException,
  InteractionQueryException
} from '@joinus/server/base';
import { EventInteractionsConfig } from '@joinus/server/config';
import { cacheKey, NeoArrayResult, NeoResult, RedisCacheService } from '@joinus/server/core';
import { Connection, Node, node, relation } from 'cypher-query-builder';
import { add, sub } from 'date-fns';

import { EventNode, EventNodeSchema } from '../../event-recommendations/event.neo4j';
import { UserNodeSchema } from '../../user-recommendations';
import { SuperlikesRelation, SuperlikesRelationSchema } from '../event-interactions.neo4j';
import { Interaction, RelationParams } from './interaction';

export const SuperlikeCacheKey = 'superlike';

export class Superlike implements Interaction<SuperlikesRelation, EventNode> {
  constructor(
    private readonly neo4j: Connection,
    private readonly redisCacheService: RedisCacheService,
    private readonly config: EventInteractionsConfig
  ) {}

  public async do(uuid: string, eventUuid: string, params?: RelationParams): Promise<SuperlikesRelation> {
    if (await this.is(uuid, eventUuid, params)) {
      throw new InteractionAlreadyExistsException('Already superliked', [
        `User ${uuid} already superliked event ${eventUuid}`
      ]);
    }

    if (await this.isCoolDown(uuid)) {
      throw new InteractionCoolDownException('Superlike cool down', [`User ${uuid} is in superlike cool down`]);
    }

    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .matchNode('event', EventNodeSchema.label, { uuid: eventUuid })
      .create([
        node('user'),
        relation('out', 'relation', SuperlikesRelationSchema.label, params?.relation),
        node('event')
      ])
      .raw('SET relation.createdAt = datetime()')
      .return('relation')
      .first()) as NeoResult<{ relation: SuperlikesRelation }>;

    if (!result) {
      throw new InteractionQueryException('Could not create relation', [
        `Could not create superlike relation for user ${uuid} and event ${eventUuid}`
      ]);
    }

    await this.setCoolDown(uuid, this.config.coolDown);

    return result.relation;
  }

  public async undo(_uuid: string, _eventUuid: string, _params?: RelationParams): Promise<EventNode> {
    throw new InteractionException('Superlike cannot be undone');
  }

  public async is(uuid: string, eventUuid: string, params?: RelationParams): Promise<boolean> {
    return this.neo4j
      .match([
        node('user', UserNodeSchema.label, { uuid }),
        relation('out', '', SuperlikesRelationSchema.label, params?.relation),
        node('event', EventNodeSchema.label, { uuid: eventUuid })
      ])
      .return('event')
      .first()
      .then((event) => !!event);
  }

  public async get(uuid: string): Promise<EventNode[]> {
    const result = (await this.neo4j
      .match([
        node('user', UserNodeSchema.label, { uuid }),
        relation('out', 'relation', SuperlikesRelationSchema.label),
        node('event', EventNodeSchema.label)
      ])
      .return('event')
      .run()) as NeoArrayResult<{ event: EventNode }>;

    return result.map((r) => r.event);
  }

  public async isCoolDown(uuid: string): Promise<boolean> {
    const result = await this.redisCacheService.get(cacheKey(SuperlikeCacheKey, uuid));

    return !!result;
  }

  public async setCoolDown(uuid: string, ttl: number): Promise<void> {
    await this.redisCacheService.set(cacheKey(SuperlikeCacheKey, uuid), new Date().toISOString(), ttl);
  }

  public async getCoolDown(uuid: string): Promise<Date> {
    const result = await this.redisCacheService.get(cacheKey(SuperlikeCacheKey, uuid));

    if (!result) return sub(new Date(), { days: 1 });

    if (typeof result !== 'string') {
      throw new InteractionQueryException('Could not get cool down', [
        `Could not get superlike cool down for user ${uuid}`
      ]);
    }

    return new Date(result);
  }
}
