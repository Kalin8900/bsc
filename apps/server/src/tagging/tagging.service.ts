import { TagNotFoundException, TagQueryFailedException, TagTooManyException } from '@joinus/server/base';
import { InjectNeo4j, NeoArrayResult, NeoResult } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { Connection, node, relation } from 'cypher-query-builder';

import { EventNodeSchema } from '../event-recommendations';
import { TagCreateDto } from './dto';
import { TaggedEventRelationSchema, TagNode, TagNodeSchema } from './tagging.neo4j';

@Injectable()
export class TaggingService {
  constructor(
    @InjectNeo4j()
    private readonly neo4j: Connection
  ) {}

  public async getEventTags(uuid: string): Promise<TagNode[]> {
    const result = (await this.neo4j
      .match([
        node('event', EventNodeSchema.label, { uuid }),
        relation('out', 'rel', TaggedEventRelationSchema.label),
        node('tag', TagNodeSchema.label)
      ])
      .return('tag')
      .run()) as NeoArrayResult<{ tag: TagNode }>;

    return result.map((record) => record.tag);
  }

  public async getOne(name: string): Promise<TagNode> {
    const result = (await this.neo4j
      .matchNode('tag', TagNodeSchema.label, { name })
      .return('tag')
      .first()) as NeoResult<{ tag: TagNode }>;

    if (!result) {
      throw new TagNotFoundException([`Tag with name ${name} not found`]);
    }

    return result.tag;
  }

  public async eventTagsCount(uuid: string): Promise<number> {
    const result = (await this.neo4j
      .match([
        node('event', EventNodeSchema.label, { uuid }),
        relation('out', 'rel', TaggedEventRelationSchema.label),
        node('tag', TagNodeSchema.label)
      ])
      .return('COUNT(tag) AS count')
      .first()) as NeoResult<{ count: number }>;

    if (!result) {
      throw new TagNotFoundException([`Event with uuid ${uuid} not found`]);
    }

    return result.count;
  }

  public async tag(uuid: string, dto: TagCreateDto): Promise<TagNode> {
    if ((await this.eventTagsCount(uuid)) >= 5) {
      throw new TagTooManyException([`Event with uuid ${uuid} already has 5 tags. Cannot add more.`]);
    }

    const result = (await this.neo4j
      .matchNode('event', EventNodeSchema.label, { uuid })
      .merge([node('tag', TagNodeSchema.label, dto)])
      .merge([node('event'), relation('out', 'rel', TaggedEventRelationSchema.label, {}), node('tag')])
      .raw('SET rel.createdAt = datetime()')
      .return('tag')
      .first()) as NeoResult<{ tag: TagNode }>;

    if (!result) {
      throw new TagQueryFailedException([`Failed to tag event with uuid ${uuid} with tag ${dto.name}`]);
    }

    return result.tag;
  }

  public async untag(uuid: string, name: string): Promise<TagNode> {
    const result = (await this.neo4j
      .match([
        node('event', EventNodeSchema.label, { uuid }),
        relation('out', 'rel', TaggedEventRelationSchema.label),
        node('tag', TagNodeSchema.label, { name })
      ])
      .delete('rel')
      .return('tag')
      .first()) as NeoResult<{ tag: TagNode }>;

    if (!result) {
      throw new TagQueryFailedException([`Failed to untag event with uuid ${uuid} with tag ${name}. Tag not found.`]);
    }

    return result.tag;
  }
}
