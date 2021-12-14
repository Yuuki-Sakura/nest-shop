import { nanoid } from '@adachi-sakura/nest-shop-common';
import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { context, Span, SpanStatusCode, trace } from '@opentelemetry/api';
import rTracer from 'cls-rtracer';
import { Logger, LoggerOptions, QueryRunner } from 'typeorm';
import { PlatformTools } from 'typeorm/platform/PlatformTools';

@Injectable()
export class TypeOrmLogger implements Logger {
  private readonly logger = new NestLogger('TypeORM');
  constructor(private options?: LoggerOptions) {
    console.log(options);
  }
  log(level: 'log' | 'info' | 'warn', message: any): any {
    if (
      this.options === 'all' ||
      this.options === true ||
      (Array.isArray(this.options) && this.options.indexOf(level) !== -1)
    ) {
      if (level === 'info') level = 'log';
      this.logger[level](message);
    }
  }

  logMigration(message: string): any {
    this.logger.log(message);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    if (queryRunner) {
      if (rTracer.id()) {
        const tracer = trace.getTracer('default');
        const currentSpan = trace.getSpan(context.active());
        if (currentSpan) {
          const span = tracer.startSpan(
            'TypeORM',
            {},
            trace.setSpan(context.active(), currentSpan),
          );
          span.setAttributes({
            query,
            parameters,
          });
          queryRunner.data.span = span;
        }
      }
      queryRunner.data.queryId = nanoid(20);
      queryRunner.data.queryAt = Date.now();
    }
    if (
      this.options === 'all' ||
      this.options === true ||
      (Array.isArray(this.options) && this.options.indexOf('query') !== -1)
    ) {
      this.logger.log(
        (!queryRunner ? '' : `[query-id: ${queryRunner.data.queryId}] `) +
          `query: ` +
          PlatformTools.highlightSql(
            `${query}` +
              (parameters && parameters.length
                ? ` -- PARAMETERS: ${this.stringifyParams(parameters)}`
                : ''),
          ),
      );
    }
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    if (queryRunner && queryRunner.data.span) {
      const span = queryRunner.data.span as Span;
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: typeof error === 'string' ? error : error.message,
      });
      span.end();
    }
    if (
      this.options === 'all' ||
      this.options === true ||
      (Array.isArray(this.options) && this.options.indexOf('error') !== -1)
    ) {
      this.logger.error(
        (!queryRunner ? '' : `[query-id: ${queryRunner.data.queryId}] `) +
          `query: ` +
          PlatformTools.highlightSql(
            `${query}` +
              (parameters && parameters.length
                ? ` -- PARAMETERS: ${this.stringifyParams(parameters)}`
                : ''),
          ),
        error,
      );
    }
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    if (queryRunner && queryRunner.data.span) {
      (queryRunner.data.span as Span).end();
    }
    this.logger.log(
      (!queryRunner ? '' : `[query-id: ${queryRunner.data.queryId}] `) +
        `query: ` +
        PlatformTools.highlightSql(
          `${query}` +
            (parameters && parameters.length
              ? ` -- PARAMETERS: ${this.stringifyParams(parameters)}`
              : ''),
        ) +
        ` execution-time: ${Date.now() - queryRunner.data.queryAt}ms`,
    );
  }

  logSchemaBuild(message: string): any {
    if (
      this.options === 'all' ||
      (Array.isArray(this.options) && this.options.indexOf('schema') !== -1)
    ) {
      this.logger.log(message);
    }
  }

  // -------------------------------------------------------------------------
  // Protected Methods
  // -------------------------------------------------------------------------

  /**
   * Converts parameters to a string.
   * Sometimes parameters can have circular objects and therefor we are handle this case too.
   */
  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}
