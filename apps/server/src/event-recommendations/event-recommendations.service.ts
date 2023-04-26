import { EventRecommendation, SimilarEvent } from '@joinus/domain';
import { EventNotFoundException } from '@joinus/server/base';
import { InjectNeo4j, NeoArrayResult, NeoResult, PageDto, Point } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { Connection, greaterEqualTo, node, relation } from 'cypher-query-builder';

import { EventCategoryRelationSchema } from '../categorization';
import { LikesRelationSchema } from '../event-interactions';
import { TaggedEventRelationSchema } from '../tagging';
import { UserNodeSchema } from '../user-recommendations';
import { EventNodePropsDto } from './dto/event-node-props.dto';
import { EventCreatorRelationSchema, EventNode, EventNodeSchema } from './event.neo4j';

@Injectable()
export class EventRecommendationsService {
  constructor(
    @InjectNeo4j()
    private readonly neo4j: Connection
  ) {}

  public async create(event: EventNodePropsDto, author: string): Promise<NeoResult<{ event: EventNode }>> {
    return this.neo4j
      .matchNode('author', UserNodeSchema.label, { uuid: author })
      .create([
        node('author'),
        relation('out', 'relation', EventCreatorRelationSchema.label, {}),
        node('event', EventNodeSchema.label, {
          uuid: event.uuid,
          lat: event.lat,
          long: event.long
        })
      ])
      .raw('SET relation.createdAt = datetime()')
      .return('event')
      .first() as Promise<NeoResult<{ event: EventNode }>>;
  }

  public async getOne(uuid: string): Promise<EventNode> {
    const result = (await this.neo4j
      .matchNode('event', EventNodeSchema.label, { uuid })
      .return('event')
      .first()) as NeoResult<{ event: EventNode }>;

    if (!result) {
      throw new EventNotFoundException([`Event with uuid ${uuid} not found`]);
    }

    return result.event;
  }

  public async getRecommendations(uuid: string, point: Point, page?: PageDto): Promise<EventRecommendation[]> {
    const result = (await this.neo4j
      .match([
        node('u', UserNodeSchema.label, { uuid }),
        relation('out', '', LikesRelationSchema.label, {}),
        node('e', EventNodeSchema.label)
      ])
      .match([node('others', UserNodeSchema.label), relation('out', '', LikesRelationSchema.label, {}), node('e')])
      .match([
        node('others'),
        relation('out', '', LikesRelationSchema.label, {}),
        node('otherEvents', EventNodeSchema.label)
      ])
      .raw('WHERE otherEvents.uuid <> e.uuid')
      .with(
        `otherEvents, point.distance(point({longitude: ${point.coordinates[0]}, latitude: ${point.coordinates[1]}}), point({longitude: otherEvents.long, latitude: otherEvents.lat})) as distance`
      )
      .orderBy('distance')
      .return('otherEvents.uuid as uuid, distance')
      .skip(page?.skip || 0)
      .limit(page?.take || 10)
      .run()) as NeoArrayResult<{ uuid: string; distance: number }>;

    return result;
  }

  public async getSimilar(uuid: string, point: Point, page?: PageDto): Promise<SimilarEvent[]> {
    const result = (await this.neo4j
      .match([
        node('e', EventNodeSchema.label, { uuid }),
        relation('out', '', `${EventCategoryRelationSchema.label}|${TaggedEventRelationSchema.label}`, {}),
        node(),
        relation('in', '', `${EventCategoryRelationSchema.label}|${TaggedEventRelationSchema.label}`, {}),
        node('e2', EventNodeSchema.label)
      ])
      .raw('WHERE e.uuid <> e2.uuid')
      .with(
        `e, e2, point.distance(point({longitude: ${point.coordinates[0]}, latitude: ${point.coordinates[1]}}), point({longitude: e2.long, latitude: e2.lat})) as distance`
      )
      .orderBy('distance', 'desc')
      .with('e, collect(e2) as others, collect(distance)[0] as maxDistance')
      .raw('UNWIND others as e2')
      .with('e, e2, maxDistance')
      .match([node('e'), relation('out', '', EventCategoryRelationSchema.label, {}), node('e_cats')])
      .match([node('e2'), relation('out', '', EventCategoryRelationSchema.label, {}), node('e2_cats')])
      .match([node('e'), relation('out', '', TaggedEventRelationSchema.label, {}), node('e_tags')])
      .match([node('e2'), relation('out', '', TaggedEventRelationSchema.label, {}), node('e2_tags')])
      .with(
        `e, e2, gds.similarity.jaccard(collect(distinct id(e_cats)), collect(distinct id(e2_cats))) as cat_jaccard, gds.similarity.jaccard(collect(distinct id(e_tags)), collect(distinct id(e2_tags))) as tags_jaccard, point.distance(point({longitude: ${point.coordinates[0]}, latitude: ${point.coordinates[1]}}), point({longitude: e2.long, latitude: e2.lat})) as distance, maxDistance`
      )
      .return(
        'e2.uuid as uuid, cat_jaccard as catSimilarity, tags_jaccard as tagsSimilarity, distance / maxDistance as distancePoints, cat_jaccard + tags_jaccard - distance / maxDistance as totalSimilarity, distance'
      )
      .orderBy('totalSimilarity', 'desc')
      .skip(page?.skip ?? 0)
      .limit(page?.take ?? 10)
      .run()) as NeoArrayResult<SimilarEvent>;

    return result;
  }

  public async update(event: EventNodePropsDto): Promise<EventNode> {
    const result = (await this.neo4j
      .matchNode('event', EventNodeSchema.label, { uuid: event.uuid })
      .set({
        values: {
          'event.uuid': event.uuid,
          'event.lat': event.lat,
          'event.long': event.long
        }
      })
      .return('event')
      .first()) as NeoResult<{ event: EventNode }>;

    if (!result) {
      throw new EventNotFoundException([`Event with uuid ${event.uuid} not found`]);
    }

    return result.event;
  }

  public async updateProperty<T extends keyof EventNodePropsDto>(
    uuid: string,
    property: T,
    value: EventNodePropsDto[T]
  ): Promise<EventNode> {
    const result = (await this.neo4j
      .matchNode('event', EventNodeSchema.label, { uuid })
      .set({
        values: {
          [`event.${property}`]: value
        }
      })
      .return('event')
      .first()) as NeoResult<{ event: EventNode }>;

    if (!result) {
      throw new EventNotFoundException([`Event with uuid ${uuid} not found`]);
    }

    return result.event;
  }

  public async delete(uuid: string): Promise<EventNode> {
    const result = (await this.neo4j
      .matchNode('event', EventNodeSchema.label, { uuid })
      .detachDelete('event')
      .return('event')
      .first()) as NeoResult<{ event: EventNode }>;

    if (!result) {
      throw new EventNotFoundException([`Event with uuid ${uuid} not found`]);
    }

    return result.event;
  }

  public mapToDto(event: EventNode): EventNodePropsDto {
    return {
      uuid: event.properties.uuid,
      lat: event.properties.lat,
      long: event.properties.long
    };
  }
}
