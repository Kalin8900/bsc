import { Relation } from 'cypher-query-builder';

export const EventCategoryRelationSchema = {
  label: 'HAS_CATEGORY',
  properties: {
    createdAt: {}
  }
};

export interface EventCategoryRelation extends Relation {
  label: typeof EventCategoryRelationSchema.label;
  properties: {};
}
