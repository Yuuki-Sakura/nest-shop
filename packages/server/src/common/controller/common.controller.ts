import { Logger } from '@nestjs/common';
import {
  AfterInvoke,
  BeforeInvoke,
  InvokeContext,
} from '@/common/decorator/enable-method-listener.decorator';

export abstract class CommonController {
  logger: Logger;
  protected constructor(context: string) {
    this.logger = new Logger(context);
  }

  @BeforeInvoke()
  protected beforeInvoke(context: InvokeContext, method: string, args) {
    context.data.invokeAt = Date.now();
    this.logger.log(`method: ${method} args: ${args}`, context.name);
  }

  @AfterInvoke()
  protected afterInvoke(context: InvokeContext, method: string) {
    this.logger.log(
      `method: ${method} invoke-time: ${Date.now() - context.data.invokeAt}ms`,
      context.name,
    );
  }
}
