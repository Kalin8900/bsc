import { Relation } from 'cypher-query-builder';

export const FriendsRelationSchema = {
  label: 'FRIEND_OF'
};

export const FriendsRequestRelationSchema = {
  label: 'REQUESTED_FRIEND_OF'
};

export interface FriendsRelation extends Relation {
  label: typeof FriendsRelationSchema.label;
  properties: {};
}

export interface FriendsRequestRelation extends Relation {
  label: typeof FriendsRequestRelationSchema.label;
  properties: {};
}
