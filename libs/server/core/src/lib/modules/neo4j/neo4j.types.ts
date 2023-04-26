import { Neo4jConfig } from '@joinus/server/config';
import { ModuleMetadata } from '@nestjs/common';

export interface Neo4jModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<Neo4jConfig> | Neo4jConfig;
}

export type NeoResult<T extends Record<string, any>> =
  | {
      [P in keyof T]: T[P];
    }
  | undefined;

export type NeoArrayResult<T extends Record<string, any>> = {
  [P in keyof T]: T[P];
}[];
