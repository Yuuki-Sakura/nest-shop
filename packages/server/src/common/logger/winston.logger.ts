import { LoggerService } from '@nestjs/common';
import { context as traceContext, trace } from '@opentelemetry/api';
import clc from 'cli-color';
import bare from 'cli-color/bare';
import rTracer from 'cls-rtracer';
import safeStringify from 'fast-safe-stringify';
import { WinstonModule } from 'nest-winston';
import { inspect } from 'util';
import { format, transports } from 'winston';
export const WinstonLogger: LoggerService = WinstonModule.createLogger({
  exitOnError: false,
  transports: [
    new transports.Console({
      format: format.combine(
        // format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS A ZZ',
        }),
        // format.ms(),
        format.printf((info) => {
          const { context, level, timestamp, message, ms, ...meta } = info;
          const nestLikeColorScheme: Record<string, bare.Format> = {
            info: clc.green,
            error: clc.red,
            warn: clc.yellow,
            debug: clc.magentaBright,
            verbose: clc.cyanBright,
          };
          const color =
            nestLikeColorScheme[level] || ((text: string): string => text);

          const stringifiedMeta = safeStringify(meta);
          const formattedMeta = inspect(JSON.parse(stringifiedMeta), {
            colors: true,
            depth: null,
          });
          const requestId = rTracer.id();
          const { traceId, spanId } =
            trace.getSpan(traceContext.active())?.spanContext() ?? {};
          return (
            `${clc.yellow(`[Nest Shop]`)} ` +
            // `[${clc.yellow(
            //   level.charAt(0).toUpperCase() + level.slice(1),
            // )}] ` +
            color(`[${level.toUpperCase()}] `) +
            ('undefined' !== typeof timestamp
              ? clc.green(`[${timestamp}] `)
              : '') +
            ('undefined' !== typeof context
              ? `${clc.yellow('[' + context + ']')} `
              : '') +
            // ('undefined' !== typeof requestId
            //   ? clc.green(`[request-id: ${requestId}] `)
            //   : '') +
            ('undefined' !== typeof traceId
              ? clc.green(`[trace-id: ${traceId}] `)
              : '') +
            ('undefined' !== typeof spanId
              ? clc.green(`[span-id: ${spanId}] `)
              : '') +
            `${color(message)} - ` +
            `${formattedMeta}` +
            ('undefined' !== typeof ms ? ` ${clc.yellow(ms)}` : '')
          );
        }),
      ),
    }),
  ],
});
