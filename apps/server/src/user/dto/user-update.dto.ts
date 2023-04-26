import { UserEntity } from '@joinus/domain';

import { UserDto } from './user.dto';

export class UserUpdateDto extends UserDto implements UserEntity {}
