import { Credentials, ConnectionOptions } from 'cypher-query-builder';

export interface Neo4jConfig {
  url: string;
  auth: Credentials;
  options: ConnectionOptions;
}

export default (): { neo4j: Neo4jConfig } => ({
  neo4j: {
    url: process.env.NEO4J_URL || 'bolt://localhost:7687',
    auth: {
      username: process.env.NEO4J_USERNAME || 'neo4j',
      password: process.env.NEO4J_PASSWORD || 'neo4j'
    },
    options: {
      driverConfig: {
        encrypted: process.env.NEO4J_ENCRYPTED === 'true'
      }
    }
  }
});
