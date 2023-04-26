import { Entity, Schema } from 'redis-om';

export interface EventSearch {
  uuid: string;
  name: string;
  description: string;
}

export class EventSearch extends Entity {}

export const EventSearchSchema = new Schema(EventSearch, {
  uuid: { type: 'string' },
  name: { type: 'text' },
  description: { type: 'text' }
});
