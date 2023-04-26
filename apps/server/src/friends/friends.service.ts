import { InjectNeo4j, NeoArrayResult, NeoResult } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { Connection, node, relation } from 'cypher-query-builder';

import { UserNode, UserNodeSchema } from '../user-recommendations';
import {
  FriendsRelation,
  FriendsRelationSchema,
  FriendsRequestRelation,
  FriendsRequestRelationSchema
} from './friends.neo4j';

@Injectable()
export class FriendsService {
  constructor(
    @InjectNeo4j()
    private readonly neo4j: Connection
  ) {}

  public async getFriends(uuid: string): Promise<UserNode[]> {
    const result = (await this.neo4j
      .match([
        node('user', UserNodeSchema.label, { uuid }),
        relation('in', '', FriendsRelationSchema.label),
        node('friend', UserNodeSchema.label)
      ])
      .return('friend')
      .run()) as NeoArrayResult<{ friend: UserNode }>;

    return result.map((r) => r.friend);
  }

  public async getFriendRequests(uuid: string): Promise<UserNode[]> {
    const result = (await this.neo4j
      .match([
        node('user', UserNodeSchema.label, { uuid }),
        relation('in', '', FriendsRequestRelationSchema.label),
        node('friend', UserNodeSchema.label)
      ])
      .return('friend')
      .run()) as NeoArrayResult<{ friend: UserNode }>;

    return result.map((r) => r.friend);
  }

  public async isFriend(uuid: string, friendUuid: string): Promise<boolean> {
    return this.neo4j
      .match([
        node('user', UserNodeSchema.label, { uuid }),
        relation('out', '', FriendsRelationSchema.label),
        node('friend', UserNodeSchema.label, { uuid: friendUuid })
      ])
      .return('friend')
      .first()
      .then((friend) => !!friend);
  }

  public async isRequestSent(uuid: string, friendUuid: string): Promise<boolean> {
    return this.neo4j
      .match([
        node('user', UserNodeSchema.label, { uuid }),
        relation('out', '', FriendsRequestRelationSchema.label),
        node('friend', UserNodeSchema.label, { uuid: friendUuid })
      ])
      .return('friend')
      .first()
      .then((friend) => !!friend);
  }

  public async isFriendOrRequestSent(uuid: string, friendUuid: string): Promise<boolean> {
    return this.neo4j
      .match([
        node('user', UserNodeSchema.label, { uuid }),
        relation('out', '', [FriendsRelationSchema.label, FriendsRequestRelationSchema.label]),
        node('friend', UserNodeSchema.label, { uuid: friendUuid })
      ])
      .return('friend')
      .first()
      .then((friend) => !!friend);
  }

  public async sendFriendRequest(uuid: string, friendUuid: string): Promise<FriendsRequestRelation> {
    const isInProgress = await this.isFriendOrRequestSent(uuid, friendUuid);

    if (isInProgress) {
      throw new Error('Friend request already in progress'); // FIXME: Use custom error
    }

    const result = (await this.neo4j
      .match([node('user', UserNodeSchema.label, { uuid })])
      .match([node('friend', UserNodeSchema.label, { uuid: friendUuid })])
      .create([node('user'), relation('out', 'relation', FriendsRequestRelationSchema.label, {}), node('friend')])
      .raw('SET relation.createdAt = datetime()')
      .return('relation')
      .first()) as NeoResult<{ relation: FriendsRequestRelation }>;

    if (!result) {
      throw new Error('Friend request failed'); // FIXME: Use custom error
    }

    return result.relation;
  }

  public async confirmFriendRequest(uuid: string, friendUuid: string): Promise<FriendsRelation> {
    const isRequestSent = await this.isRequestSent(friendUuid, uuid);

    if (!isRequestSent) {
      throw new Error('Friend request not found'); // FIXME: Use custom error
    }

    const isFriend = await this.isFriend(uuid, friendUuid);

    if (isFriend) {
      throw new Error('Friend request already confirmed'); // FIXME: Use custom error
    }

    const result = (await this.neo4j
      .match([
        node('user', UserNodeSchema.label, { uuid }),
        relation('in', 'request', FriendsRequestRelationSchema.label),
        node('friend', UserNodeSchema.label, { uuid: friendUuid })
      ])
      .create([node('user'), relation('out', 'relation', FriendsRelationSchema.label, {}), node('friend')])
      .raw('SET relation.createdAt = datetime()')
      .delete('request')
      .return('relation')
      .first()) as NeoResult<{ relation: FriendsRelation }>;

    if (!result) {
      throw new Error('Friend request confirmation failed'); // FIXME: Use custom error
    }

    return result.relation;
  }

  /**
   * @deprecated Only for fake data
   * TODO: Move to fake data service
   */
  public async createFriend(uuid: string, friendUuid: string): Promise<void> {
    await this.neo4j
      .match([node('user', UserNodeSchema.label, { uuid })])
      .match([node('friend', UserNodeSchema.label, { uuid: friendUuid })])
      .create([node('user'), relation('out', 'relation', FriendsRelationSchema.label, {}), node('friend')])
      .raw('SET relation.createdAt = datetime()')
      .return('relation')
      .first();
  }

  public async declineFriendRequest(uuid: string, friendUuid: string): Promise<UserNode> {
    const result = (await this.neo4j
      .match([
        node('user', UserNodeSchema.label, { uuid }),
        relation('in', 'request', FriendsRequestRelationSchema.label),
        node('friend', UserNodeSchema.label, { uuid: friendUuid })
      ])
      .delete('request')
      .return('friend')
      .first()) as NeoResult<{ friend: UserNode }>;

    if (!result) {
      throw new Error('Friend request not found'); // FIXME: Use custom error
    }

    return result.friend;
  }

  public async deleteFriend(uuid: string, friendUuid: string): Promise<UserNode> {
    const result = (await this.neo4j
      .match([
        node('user', UserNodeSchema.label, { uuid }),
        relation('in', 'relation', FriendsRelationSchema.label),
        node('friend', UserNodeSchema.label, { uuid: friendUuid })
      ])
      .delete('relation')
      .return('friend')
      .first()) as NeoResult<{ friend: UserNode }>;

    if (!result) {
      throw new Error('Friend not found'); // FIXME: Use custom error
    }

    return result.friend;
  }

  public async cancelFriendRequest(uuid: string, friendUuid: string): Promise<UserNode> {
    const result = (await this.neo4j
      .match([
        node('user', UserNodeSchema.label, { uuid }),
        relation('out', 'relation', FriendsRequestRelationSchema.label),
        node('friend', UserNodeSchema.label, { uuid: friendUuid })
      ])
      .delete('relation')
      .return('friend')
      .first()) as NeoResult<{ friend: UserNode }>;

    if (!result) {
      throw new Error('Friend request not found'); // FIXME: Use custom error
    }

    return result.friend;
  }
}
