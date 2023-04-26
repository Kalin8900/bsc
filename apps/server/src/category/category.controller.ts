import { CategoryNotFoundException } from '@joinus/server/base';
import { DeleteResultDto, EntityNotFoundErrorFilter, LogRequest, Monitor, Respond, UuidDto } from '@joinus/server/core';
import { Body, Controller, Delete, Get, Param, Post, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth';
import { CategoryService } from './category.service';
import { CategoryCreateDto, CategoryDto } from './dto';

@ApiTags('Categories')
@Controller('categories')
@AuthGuard()
@LogRequest()
@Monitor()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('')
  @Respond([CategoryDto])
  public async getAll() {
    return this.categoryService.getAll();
  }

  @Get(':uuid')
  @Respond(CategoryDto)
  @UseFilters(new EntityNotFoundErrorFilter((message) => new CategoryNotFoundException([message])))
  public async getOne(@Param() { uuid }: UuidDto) {
    return this.categoryService.getOne(uuid);
  }

  @Post('')
  @Respond(CategoryDto)
  public async create(@Body() dto: CategoryCreateDto) {
    return this.categoryService.create(dto);
  }

  @Delete(':uuid')
  @Respond(DeleteResultDto)
  @UseFilters(new EntityNotFoundErrorFilter((message) => new CategoryNotFoundException([message])))
  public async delete(@Param() { uuid }: UuidDto) {
    return this.categoryService.delete(uuid);
  }
}
