import { Inject } from '@nestjs/common';

import { getEntityRepositoryToken } from './redis-om.constants';

export const InjectSearchRepository = (entity: any) => Inject(getEntityRepositoryToken(entity));
