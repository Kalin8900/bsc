import { Node, Relation } from 'cypher-query-builder';

export const EventNodeSchema = {
  label: 'Event',
  properties: {
    uuid: {
      type: 'string'
    },
    lat: {
      type: 'number'
    },
    long: {
      type: 'number'
    }
  }
};

export interface EventNodeProps {
  uuid: string;
  lat: number;
  long: number;
}

export type EventNode = Node<EventNodeProps>;

export const EventCreatorRelationSchema = {
  label: 'CREATED',
  properties: {
    createdAt: {}
  }
};

export interface EventCreatorRelation extends Relation {
  label: typeof EventCreatorRelationSchema.label;
  properties: {};
}
