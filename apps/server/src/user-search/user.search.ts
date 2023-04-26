import { Entity, Schema } from 'redis-om';

export interface UserSearch {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export class UserSearch extends Entity {}

export const UserSearchSchema = new Schema(UserSearch, {
  uuid: { type: 'string' },
  firstName: { type: 'text' },
  lastName: { type: 'text' },
  email: { type: 'text' },
  phone: { type: 'text' }
});
