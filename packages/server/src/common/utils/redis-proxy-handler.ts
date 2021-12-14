import { Logger } from '@nestjs/common';
import { context, SpanStatusCode, trace } from '@opentelemetry/api';
import IORedis, { Command } from 'ioredis';

export const redisProxyHandler = (
  logger: Logger,
): ProxyHandler<IORedis.Redis> => ({
  get(target: IORedis.Redis, property: keyof IORedis.Redis): any {
    if (property !== 'sendCommand') {
      return target[property];
    }
    return new Proxy(target[property], {
      apply(target, thisArg: IORedis.Redis, argArray: Command[]): any {
        const invokeAt = Date.now();
        const command = argArray[0];
        const commandName = command.name.toUpperCase();
        const tracer = trace.getTracer('default');
        const currentSpan =
          trace.getSpan(context.active()) ?? tracer.startSpan('default');
        return context.with(
          trace.setSpan(context.active(), currentSpan),
          () => {
            const span = tracer.startSpan(`Redis: ${commandName}`);
            span.setAttributes({
              command: commandName,
              args: command['args'],
            });
            logger.log(
              `[invoke-at: ${invokeAt}] [command: ${commandName}] args: ${JSON.stringify(
                command['args'],
              )}`,
            );
            (command['promise'] as Promise<any>)
              .then((res) => {
                span.setAttributes({
                  result: res,
                });
                span.end();
                logger.log(
                  `[invoke-at: ${invokeAt}] [command: ${commandName}] args: ${JSON.stringify(
                    command['args'],
                  )} result: ${JSON.stringify(res)} time: ${
                    Date.now() - invokeAt
                  }ms`,
                );
                return res;
              })
              .catch((err: Error) => {
                span.recordException(err);
                span.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: err.message,
                });
                span.end();
                logger.error(
                  `[invoke-at: ${invokeAt}] [command: ${commandName}] args: ${JSON.stringify(
                    command['args'],
                  )} error: ${err.message} time: ${Date.now() - invokeAt}ms`,
                  err,
                );
                throw err;
              });
            return target.apply(thisArg, argArray);
          },
        );
      },
    });
  },
});
