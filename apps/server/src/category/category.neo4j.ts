import { Node } from 'cypher-query-builder';

export const CategoryNodeSchema = {
  label: 'Category',
  properties: {
    uuid: {
      type: 'string'
    }
  }
};

export interface CategoryNodeProps {
  uuid: string;
}

export type CategoryNode = Node<CategoryNodeProps>;
