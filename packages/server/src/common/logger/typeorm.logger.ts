import { Logger, QueryRunner } from 'typeorm';
import { Logger as NestLogger } from '@nestjs/common';
export class TypeormLogger implements Logger {
  private readonly logger = new NestLogger('TypeORM');
  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner,
  ): any {
    if (level === 'info') level = 'log';
    this.logger[level](message);
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    this.logger.log(message);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.log(`query: ${query} parameters: ${parameters}`);
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    this.logger.error(`query: ${query} parameters: ${parameters}`, error);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    this.logger.warn(`query: ${query} parameters: ${parameters} time: ${time}`);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    this.logger.log(message);
  }
}
