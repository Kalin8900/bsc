import { Inject } from '@nestjs/common';

import { Neo4jConfig, Neo4jQueryBuilder } from './neo4j.constants';

export const InjectNeo4j = () => Inject(Neo4jQueryBuilder);
export const InjectNeo4jConfig = () => Inject(Neo4jConfig);
