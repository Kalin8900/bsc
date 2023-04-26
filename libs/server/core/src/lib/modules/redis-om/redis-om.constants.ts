import { Schema } from 'redis-om';

export const getSchemaRepositoryToken = (schema: Schema<any>) => schema.entityCtor.name;
export const getEntityRepositoryToken = (entity: any) => entity.name;

export type withEntityId<T> = T & { entityId: string };
