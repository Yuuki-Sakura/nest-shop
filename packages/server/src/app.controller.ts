/**
 * App controllers.
 * @file 主页控制器
 * @module app/controllers
 */

import { Controller, Get, Inject, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version, author } = require('../package.json');

@Controller()
export class AppController {
  @Inject()
  private readonly logger: Logger;

  @Get()
  root(): any {
    this.logger.log('Controller Test', 'AppController');
    return {
      name,
      version,
      author,
    };
  }
}
