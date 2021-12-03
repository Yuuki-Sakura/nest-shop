/**
 * App controllers.
 * @file 主页控制器
 * @module app/controllers
 */

import { Span } from '@/common/decorator/span.decorator';
import { Controller, Get } from '@nestjs/common';
import { author, name, version } from '../package.json';

@Controller()
@Span()
export class AppController {
  @Get()
  root(): any {
    return {
      name,
      version,
      author,
    };
  }
}
