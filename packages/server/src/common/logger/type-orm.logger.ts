import { nanoid } from '@adachi-sakura/nest-shop-common';
import { Logger, QueryRunner } from 'typeorm';
import { Injectable, Logger as NestLogger } from '@nestjs/common';

@Injectable()
export class TypeOrmLogger implements Logger {
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
    queryRunner.data.queryId = nanoid(20);
    queryRunner.data.queryAt = Date.now();
    this.logger.log(
      `[query-id: ${queryRunner.data.queryId}] query: ${query}` +
        (parameters ? ` parameters: ${JSON.stringify(parameters)}` : ''),
    );
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    this.logger.error(
      `[query-id: ${queryRunner.data.queryId}] query: ${query}` +
        (parameters ? ` parameters: ${JSON.stringify(parameters)}` : ''),
      error,
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    this.logger.log(
      `[query-id: ${queryRunner.data.queryId}] query: ${query} ` +
        (parameters ? ` parameters: ${JSON.stringify(parameters)}` : '') +
        ` query-time: ${Date.now() - queryRunner.data.queryAt}ms`,
    );
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    this.logger.log(message);
  }
}
