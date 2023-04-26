import { Node } from 'cypher-query-builder';

export const UserNodeSchema = {
  label: 'User',
  properties: {
    uuid: {
      type: 'string'
    }
  }
};

export interface UserNodeProps {
  uuid: string;
}

export type UserNode = Node<UserNodeProps>;
