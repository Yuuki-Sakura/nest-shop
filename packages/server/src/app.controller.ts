/**
 * App controllers.
 * @file 主页控制器
 * @module app/controllers
 */

import { Span } from '@/common/decorator/span.decorator';
import { Controller, Get } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version, author } = require('../package.json');

@Controller()
@Span()
export class AppController {
  @Get()
  health(): any {
    return {
      name,
      version,
      author,
    };
  }
}
