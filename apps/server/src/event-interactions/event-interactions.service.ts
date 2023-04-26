import { EventInteractionsConfigService } from '@joinus/server/config';
import { CoolDown, InjectNeo4j, RedisCacheService } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { Connection } from 'cypher-query-builder';

import { Attend, Dislike, Interest, Like, Rate, Superlike } from './strategies';

@Injectable()
export class EventInteractionsService {
  private readonly strategies;

  constructor(
    @InjectNeo4j()
    readonly neo4j: Connection,
    private readonly redisCacheService: RedisCacheService,
    private readonly eventInteractionsConfigService: EventInteractionsConfigService
  ) {
    this.strategies = {
      like: new Like(this.neo4j),
      dislike: new Dislike(this.neo4j),
      rate: new Rate(this.neo4j),
      interest: new Interest(this.neo4j),
      attend: new Attend(this.neo4j),
      superlike: new Superlike(this.neo4j, this.redisCacheService, this.eventInteractionsConfigService)
    } as const;
  }

  public strategy(strategy: keyof typeof this.strategies) {
    return this.strategies[strategy];
  }

  public async getCoolDown(uuid: string): Promise<CoolDown> {
    const datetime = await this.strategies.superlike.getCoolDown(uuid);

    const remaining = this.eventInteractionsConfigService.coolDown * 1000 + datetime.getTime() - Date.now();

    return {
      datetime,
      remaining: remaining > 0 ? remaining : 0
    };
  }

  public async getRating(uuid: string, eventUuid: string) {
    const rating = await this.strategies.rate.getRating(uuid, eventUuid);

    return {
      rating
    };
  }
}
