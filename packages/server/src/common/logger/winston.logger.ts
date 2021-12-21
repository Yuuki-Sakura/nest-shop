import { LoggerService } from '@nestjs/common';
import { context as traceContext, trace } from '@opentelemetry/api';
import clc from 'cli-color';
import bare from 'cli-color/bare';
import safeStringify from 'fast-safe-stringify';
import { WinstonModule } from 'nest-winston';
import path from 'path';
import { inspect } from 'util';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

const formatter = format.combine(
  // format.colorize(),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS ZZ',
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
    const { traceId, spanId } =
      trace.getSpan(traceContext.active())?.spanContext() ?? {};
    return (
      `${clc.yellow(`[Nest Shop]`)} ` +
      // `[${clc.yellow(
      //   level.charAt(0).toUpperCase() + level.slice(1),
      // )}] ` +
      color(`[${level.toUpperCase()}] `) +
      ('undefined' !== typeof timestamp ? clc.green(`[${timestamp}] `) : '') +
      ('undefined' !== typeof context
        ? `${clc.yellow('[' + context + ']')} `
        : '') +
      ('undefined' !== typeof traceId
        ? clc.green(`[trace-id: ${traceId}] `)
        : '') +
      ('undefined' !== typeof spanId
        ? clc.green(`[span-id: ${spanId}] `)
        : '') +
      (`${color(message)}` +
        ('undefined' !== typeof ms || formattedMeta !== '{}' ? ' - ' : '')) +
      `${formattedMeta !== '{}' ? formattedMeta : ''}` +
      ('undefined' !== typeof ms ? ` ${clc.yellow(ms)}` : '')
    );
  }),
);

export const WinstonLogger: LoggerService = WinstonModule.createLogger({
  exitOnError: false,
  format: formatter,
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      format: format.uncolorize(),
      filename: 'nest-shop-%DATE%.log',
      dirname: path.join(process.cwd(), './logs'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});
