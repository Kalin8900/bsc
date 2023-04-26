import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CategoryNeo4jFacade } from './category-neo4j.facade';
import { CategoryCreateDto } from './dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryNeo4jFacade: CategoryNeo4jFacade
  ) {}

  public async create(dto: CategoryCreateDto): Promise<Category> {
    const result = await this.categoryRepository.save(dto);
    await this.categoryNeo4jFacade.create({
      uuid: result.uuid
    });

    return result;
  }

  public async getOne(uuid: string): Promise<Category> {
    return this.categoryRepository.findOneOrFail({ where: { uuid } });
  }

  public async getAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  public async delete(uuid: string): Promise<DeleteResult> {
    await this.categoryRepository.findOneOrFail({ where: { uuid } });
    await this.categoryNeo4jFacade.delete(uuid);
    const result = await this.categoryRepository.delete({ uuid });

    return result;
  }
}
