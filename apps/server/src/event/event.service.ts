import { EventEntity } from '@joinus/domain';
import { PageDto } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { EventCreateDto, EventUpdateDto } from './dto';
import { Event } from './entities/event.entity';
import { EventCreatedEvent, EventDeletedEvent, EventUpdatedPropertyEvent, EventUpdatedEvent } from './events';
import { EventEvents } from './events/event.events';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async create(dto: EventCreateDto, authorUuid: string): Promise<Event> {
    const event = await this.eventRepository.save({
      ...dto,
      author: { uuid: authorUuid }
    });

    this.eventEmitter.emit(EventEvents.Created, new EventCreatedEvent(event));

    return this.getOne(event.uuid);
  }

  public createInstance(dto: EventCreateDto): Event {
    return this.eventRepository.create(dto);
  }

  public async getOne(uuid: string, relations?: string[]): Promise<Event> {
    return this.eventRepository.findOneOrFail({ where: { uuid }, relations });
  }

  public async getAll(relations?: string[], page?: PageDto): Promise<Event[]> {
    return this.eventRepository.find({ relations, skip: page?.skip, take: page?.take });
  }

  public async getTotalCount(): Promise<number> {
    return this.eventRepository.count();
  }

  public async update(uuid: string, dto: EventUpdateDto): Promise<Event> {
    const event = await this.eventRepository.save({
      ...dto,
      uuid
    });

    this.eventEmitter.emit(EventEvents.Updated, new EventUpdatedEvent(event));

    return this.getOne(event.uuid);
  }

  public async updateProperty<T extends keyof EventEntity>(
    uuid: string,
    property: T,
    value: EventEntity[T]
  ): Promise<UpdateResult> {
    const result = await this.eventRepository.update({ uuid }, { [property]: value });

    this.eventEmitter.emit(EventEvents.UpdatedProperty, new EventUpdatedPropertyEvent(uuid, property, value, result));

    return result;
  }

  public async delete(uuid: string): Promise<DeleteResult> {
    const result = await this.eventRepository.delete({ uuid });

    this.eventEmitter.emit(EventEvents.Deleted, new EventDeletedEvent(uuid, result));

    return result;
  }
}
