import { UserEntity } from '@joinus/domain';
import { PageDto } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { UserCreateDto, UserUpdateDto } from './dto';
import { User } from './entities/user.entity';
import { UserCreatedEvent, UserDeletedEvent, UserUpdatedEvent, UserUpdatedPropertyEvent } from './events';
import { UserEvents } from './events/user.events';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async create(dto: UserCreateDto): Promise<User> {
    const user = await this.userRepository.save(dto);

    this.eventEmitter.emit(UserEvents.Created, new UserCreatedEvent(user));

    return user;
  }

  public createInstance(user: UserCreateDto): User {
    return this.userRepository.create(user);
  }

  public async getOne(uuid: string, relations?: string[]): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { uuid }, relations });
  }

  public async getOneByEmail(email: string, relations?: string[]): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { email }, relations });
  }

  public async getOneByPhone(phone: string, relations?: string[]): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { phone }, relations });
  }

  public async getAll(relations?: string[], page?: PageDto): Promise<User[]> {
    return this.userRepository.find({ relations, skip: page?.skip, take: page?.take });
  }

  public async getTotalCount(): Promise<number> {
    return this.userRepository.count();
  }

  public async update(dto: UserUpdateDto): Promise<User> {
    const user = await this.userRepository.save(dto);

    this.eventEmitter.emit(UserEvents.Updated, new UserUpdatedEvent(user));

    return user;
  }

  public async updateProperty<T extends keyof UserEntity>(
    uuid: string,
    property: T,
    value: UserEntity[T]
  ): Promise<UpdateResult> {
    const update = await this.userRepository.update({ uuid }, { [property]: value });

    this.eventEmitter.emit(UserEvents.UpdatedProperty, new UserUpdatedPropertyEvent(uuid, property, value, update));

    return update;
  }

  public async delete(uuid: string): Promise<DeleteResult> {
    const deleted = await this.userRepository.delete({ uuid });

    this.eventEmitter.emit(UserEvents.Deleted, new UserDeletedEvent(uuid, deleted));

    return deleted;
  }
}
