import { UserNotFoundException } from '@joinus/server/base';
import { InjectNeo4j, NeoResult } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { Connection } from 'cypher-query-builder';

import { UserNodePropsDto } from './dto';
import { UserNode, UserNodeSchema } from './user.neo4j';

@Injectable()
export class UserRecommendationsService {
  constructor(
    @InjectNeo4j()
    private readonly neo4j: Connection
  ) {}

  public async create(user: UserNodePropsDto): Promise<NeoResult<{ user: UserNode }>> {
    return this.neo4j.createNode('user', UserNodeSchema.label, user).return('user').first() as Promise<
      NeoResult<{ user: UserNode }>
    >;
  }

  public async getOne(uuid: string): Promise<UserNode> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .return('user')
      .first()) as NeoResult<{ user: UserNode }>;

    if (!result) {
      throw new UserNotFoundException([`User with uuid ${uuid} not found`]);
    }

    return result.user;
  }

  public async delete(uuid: string): Promise<UserNode> {
    const result = (await this.neo4j
      .matchNode('user', UserNodeSchema.label, { uuid })
      .detachDelete('user')
      .return('user')
      .first()) as NeoResult<{ user: UserNode }>;

    if (!result) {
      throw new UserNotFoundException([`User with uuid ${uuid} not found`]);
    }

    return result.user;
  }

  public mapToDto(user: UserNode): UserNodePropsDto {
    return {
      uuid: user.properties.uuid
    };
  }
}
