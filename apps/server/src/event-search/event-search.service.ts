import { EventNotFoundException } from '@joinus/server/base';
import { InjectSearchRepository, PageDto } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { Repository } from 'redis-om';

import { EventSearchDto, EventSearchEntityDto } from './dto';
import { EventSearch } from './event.search';

@Injectable()
export class EventSearchService {
  constructor(
    @InjectSearchRepository(EventSearch)
    private readonly eventRepository: Repository<EventSearch>
  ) {}

  public async create(event: EventSearchDto): Promise<EventSearch> {
    return this.eventRepository.createAndSave({
      uuid: event.uuid,
      name: event.name,
      description: event.description
    });
  }

  public async getOne(uuid: string): Promise<EventSearch | null> {
    return this.eventRepository.search().where('uuid').equals(uuid).returnFirst();
  }

  public async search(query: string, page?: PageDto): Promise<EventSearch[]> {
    return this.eventRepository
      .search()
      .where('name')
      .matches(query)
      .or('description')
      .matches(query)
      .page(page?.skip ?? 0, page?.take ?? 10);
  }

  public async searchBy(query: string, property: keyof EventSearchEntityDto, page?: PageDto): Promise<EventSearch[]> {
    return this.eventRepository
      .search()
      .where(property)
      .matches(query)
      .page(page?.skip ?? 0, page?.take ?? 10);
  }

  public async update(dto: EventSearchDto) {
    const event = await this.getOne(dto.uuid);

    if (!event) {
      throw new EventNotFoundException([`Event with uuid ${dto.uuid} not found`]);
    }

    event.name = dto.name;
    event.description = dto.description;
    await this.eventRepository.save(event);

    return event;
  }

  public async updateProperty<T extends keyof EventSearchDto>(uuid: string, property: T, value: EventSearchDto[T]) {
    const event = await this.getOne(uuid);

    if (!event) {
      throw new EventNotFoundException([`event with uuid ${uuid} not found`]);
    }

    event[property] = value;
    await this.eventRepository.save(event);

    return event;
  }

  public async delete(uuid: string) {
    const event = await this.getOne(uuid);

    if (!event) {
      throw new EventNotFoundException([`Event with uuid ${uuid} not found`]);
    }

    await this.eventRepository.remove(event.entityId);

    return event;
  }

  public mapToDto(event: EventSearch): EventSearchEntityDto {
    return {
      uuid: event.uuid,
      name: event.name,
      description: event.description,
      entityId: event.entityId
    };
  }
}
