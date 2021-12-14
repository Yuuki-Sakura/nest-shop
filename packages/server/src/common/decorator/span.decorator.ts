import { Logger } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { context, SpanStatusCode, trace } from '@opentelemetry/api';
import rTracer from 'cls-rtracer';

export const Span =
  (typeName?: string): ClassDecorator =>
  (target) => {
    if (!typeName) {
      if (Reflect.getMetadata(PATH_METADATA, target)) typeName = 'Controller';
      if (target.name.includes('Controller')) typeName = 'Controller';
      if (target.name.includes('Guard')) typeName = 'Guard';
      if (target.name.includes('Service')) typeName = 'Service';
      if (target.name.includes('Strategy')) typeName = 'Strategy';
      if (target.name.includes('Resolver')) typeName = 'Resolver';
    }
    const logger = new Logger();
    const originTarget = target;
    Object.getOwnPropertyNames(target.prototype).forEach((key) => {
      if (key === 'constructor' || typeof target.prototype[key] !== 'function')
        return;
      const originMethod: Function = target.prototype[key];
      target.prototype[key] = function (...args: any[]) {
        const tracer = trace.getTracer('default');
        const currentSpan = trace.getSpan(context.active());
        const name = target.name;
        return context.with(
          trace.setSpan(context.active(), currentSpan),
          () => {
            const span = rTracer.id()
              ? tracer.startSpan(
                  (typeName ? `${typeName}->` : '') + `${target.name}.${key}`,
                )
              : undefined;
            span?.setAttributes({
              target: target.name,
              method: key,
            });
            const invokeAt = Date.now();
            logger.log(`method: ${key}`, name);
            if (originMethod.constructor.name === 'AsyncFunction') {
              return originMethod
                .apply(this, args)
                .then((res) => {
                  logger.log(
                    `method: ${key} invoke-time: ${Date.now() - invokeAt}ms`,
                    name,
                  );
                  return res;
                })
                .catch((e) => {
                  logger.error(
                    `method: ${key} invoke-time: ${Date.now() - invokeAt}ms`,
                    e.stack,
                    name,
                  );
                  span?.recordException(e);
                  span?.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: e.message,
                  });
                  throw e;
                })
                .finally(() => {
                  span?.end();
                });
            } else {
              let isPromise = false;
              try {
                const result = originMethod.apply(this, args);
                if (result instanceof Promise) {
                  isPromise = true;
                  result
                    .then((res) => {
                      logger.log(
                        `method: ${key} invoke-time: ${
                          Date.now() - invokeAt
                        }ms`,
                        name,
                      );
                      return res;
                    })
                    .catch((e) => {
                      logger.error(
                        `method: ${key} invoke-time: ${
                          Date.now() - invokeAt
                        }ms`,
                        e.stack,
                        name,
                      );
                      span?.recordException(e);
                      span?.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: e.message,
                      });
                      throw e;
                    })
                    .finally(() => {
                      span?.end();
                    });
                } else {
                  logger.log(
                    `method: ${key} invoke-time: ${Date.now() - invokeAt}ms`,
                    name,
                  );
                }
                return result;
              } catch (e) {
                logger.error(
                  `method: ${key} invoke-time: ${Date.now() - invokeAt}ms`,
                  e.stack,
                  name,
                );
                span?.recordException(e);
                span?.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: e.message,
                });
                throw e;
              } finally {
                if (!isPromise) span?.end();
              }
            }
          },
        );
      };

      Reflect.getOwnMetadataKeys(originMethod).forEach((metadataKey) => {
        Reflect.defineMetadata(
          metadataKey,
          Reflect.getMetadata(metadataKey, originMethod),
          target.prototype[key],
        );
      });
    });

    Reflect.getOwnMetadataKeys(originTarget).forEach((metadataKey) =>
      Reflect.defineMetadata(
        metadataKey,
        Reflect.getMetadata(metadataKey, originTarget),
        target,
      ),
    );
    return target;
  };
