import { Relation } from 'cypher-query-builder';

export const FriendsRelationSchema = {
  label: 'FRIEND_OF'
};

export interface FriendsRelation extends Relation {
  label: typeof FriendsRelationSchema.label;
  properties: {};
}

export const LikesRelationSchema = {
  label: 'LIKES'
};

export interface LikesRelation extends Relation {
  label: typeof LikesRelationSchema.label;
  properties: {};
}

export const DislikesRelationSchema = {
  label: 'DISLIKES'
};

export interface DislikesRelation extends Relation {
  label: typeof DislikesRelationSchema.label;
  properties: {};
}

export const AttendingRelationSchema = {
  label: 'ATTENDING'
};

export interface AttendingRelation extends Relation {
  label: typeof AttendingRelationSchema.label;
  properties: {};
}

export const InterestedRelationSchema = {
  label: 'INTERESTED'
};

export interface InterestedRelation extends Relation {
  label: typeof InterestedRelationSchema.label;
  properties: {};
}

export const RatedRelationSchema = {
  label: 'RATED'
};

export interface RatedRelationProperties {
  rating: number;
}

export interface RatedRelation extends Relation<RatedRelationProperties> {
  label: typeof RatedRelationSchema.label;
  properties: RatedRelationProperties;
}

export const SuperlikesRelationSchema = {
  label: 'SUPERLIKES'
};

export interface SuperlikesRelation extends Relation {
  label: typeof SuperlikesRelationSchema.label;
  properties: {};
}
