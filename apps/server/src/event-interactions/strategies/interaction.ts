import { Node, Relation } from 'cypher-query-builder';

export interface RelationParams<T extends object = {}> {
  relation: {
    [P in keyof T]: T[P];
  };
}

export interface Interaction<R extends Relation<any> = Relation, N extends Node<any> = Node> {
  /**
   * Creates a relation from the given node to the given node.
   */
  do(uuid: string, eventUuid: string, params?: RelationParams<R['properties']>): Promise<R>;
  /**
   * Removes the given relation from the given node to the given node.
   */
  undo(uuid: string, eventUuid: string, params?: RelationParams<R['properties']>): Promise<N>;
  /**
   * Returns true if the given node is connected to the given node by the given relation.
   */
  is(uuid: string, eventUuid: string, params?: RelationParams<R['properties']>): Promise<boolean>;
  /**
   * Returns all nodes that are connected to the given node by the given relation.
   */
  get(uuid: string): Promise<N[]>;
}
