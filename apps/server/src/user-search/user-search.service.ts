import { UserNotFoundException } from '@joinus/server/base';
import { InjectSearchRepository, PageDto } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { Repository } from 'redis-om';

import { UserSearchDto, UserSearchEntityDto } from './dto';
import { UserSearch } from './user.search';

@Injectable()
export class UserSearchService {
  constructor(
    @InjectSearchRepository(UserSearch)
    private readonly userRepository: Repository<UserSearch>
  ) {}

  public async create(user: UserSearchDto): Promise<UserSearch> {
    return this.userRepository.createAndSave({
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    });
  }

  public async getOne(uuid: string): Promise<UserSearch | null> {
    return this.userRepository.search().where('uuid').equals(uuid).returnFirst();
  }

  public async search(query: string, page?: PageDto): Promise<UserSearch[]> {
    return this.userRepository
      .search()
      .where('firstName')
      .matches(query)
      .or('lastName')
      .matches(query)
      .or('email')
      .matches(query)
      .or('phone')
      .matches(query)
      .page(page?.skip ?? 0, page?.take ?? 10);
  }

  public async searchBy(query: string, property: keyof UserSearchDto, page?: PageDto): Promise<UserSearch[]> {
    return this.userRepository
      .search()
      .where(property)
      .matches(query)
      .page(page?.skip ?? 0, page?.take ?? 10);
  }

  public async searchByName(query: string, page?: PageDto): Promise<UserSearch[]> {
    return this.userRepository
      .search()
      .where('firstName')
      .matches(query)
      .or('lastName')
      .matches(query)
      .page(page?.skip ?? 0, page?.take ?? 10);
  }

  public async update(dto: UserSearchDto) {
    const user = await this.getOne(dto.uuid);

    if (!user) {
      throw new UserNotFoundException([`User with uuid ${dto.uuid} not found`]);
    }

    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.email = dto.email;
    user.phone = dto.phone;
    await this.userRepository.save(user);

    return user;
  }

  public async updateProperty<T extends keyof UserSearchDto>(uuid: string, property: T, value: UserSearchDto[T]) {
    const user = await this.getOne(uuid);

    if (!user) {
      throw new UserNotFoundException([`User with uuid ${uuid} not found`]);
    }

    user[property] = value;
    await this.userRepository.save(user);

    return user;
  }

  public async delete(uuid: string) {
    const user = await this.getOne(uuid);

    if (!user) {
      throw new UserNotFoundException([`User with uuid ${uuid} not found`]);
    }

    await this.userRepository.remove(user.entityId);

    return user;
  }

  public mapToDto(user: UserSearch): UserSearchEntityDto {
    return {
      uuid: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      entityId: user.entityId
    };
  }
}
