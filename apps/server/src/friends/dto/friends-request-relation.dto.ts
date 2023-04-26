import { FriendsRequestRelation } from '../friends.neo4j';
import { FriendsRelationDto } from './friends-relation.dto';

export class FriendsRequestRelationDto extends FriendsRelationDto implements FriendsRequestRelation {}
