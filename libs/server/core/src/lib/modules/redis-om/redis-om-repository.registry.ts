import { Injectable, Logger } from '@nestjs/common';
import { Client, Repository, Schema } from 'redis-om';

@Injectable()
export class RedisOMRepositoryRegistry {
  private readonly repositories = new Map<string, Repository<any>>();
  private readonly logger = new Logger(RedisOMRepositoryRegistry.name);

  constructor(private readonly client: Client) {}

  public async registerRepository(schema: Schema<any>) {
    if (this.repositories.has(schema.entityCtor.name)) return this.repositories.get(schema.entityCtor.name);

    this.logger.log(`Adding repository for ${schema.entityCtor.name}`);
    const repository = this.client.fetchRepository(schema);

    await repository.createIndex();

    this.repositories.set(schema.entityCtor.name, repository);

    return repository;
  }

  public async registerRepositories(schemas: Schema<any>[]) {
    const repos: Repository<any>[] = [];

    for (const schema of schemas) {
      const repo = await this.registerRepository(schema);

      if (repo) repos.push(repo);
    }

    return repos;
  }

  public getRepository(name: string) {
    return this.repositories.get(name);
  }
}
