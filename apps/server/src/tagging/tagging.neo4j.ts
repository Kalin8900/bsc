import { Node, Relation } from 'cypher-query-builder';

export const TagNodeSchema = {
  label: 'Tag',
  properties: {
    name: {
      type: 'string'
    }
  }
};

export interface TagNodeProps {
  name: string;
}

export type TagNode = Node<TagNodeProps>;

export const TaggedEventRelationSchema = {
  label: 'HAS_TAG',
  properties: {}
};

export interface TaggedEventRelation extends Relation {
  label: typeof TaggedEventRelationSchema.label;
  properties: {};
}
