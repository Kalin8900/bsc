import { Event } from '@joinus/domain';
import { OmitType } from '@nestjs/swagger';

import { EventDto } from './event.dto';

export class EventUpdateDto extends OmitType(EventDto, ['author', 'createdAt', 'uuid']) implements Event {}
