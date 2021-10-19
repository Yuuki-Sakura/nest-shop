import { Logger, Module } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require('../package.json');

export class AppLogger extends Logger {
  constructor() {
    super(name);
  }
}

@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
