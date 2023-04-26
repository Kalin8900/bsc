import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleCreateDto } from './dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  getOneById(id: number) {
    return this.roleRepository.findOneByOrFail({ id });
  }

  create(role: RoleCreateDto) {
    return this.roleRepository.save(role);
  }
}
