import { Logger } from '@nestjs/common';
import { InvokeContext } from '@/common/decorator/enable-method-listener.decorator';

export abstract class CommonService {
  logger: Logger;
  protected constructor(context: string) {
    this.logger = new Logger(context);
  }

  onMethodBeforeInvoke(context: InvokeContext, method: string, args) {
    context.data.invokeAt = Date.now();
    this.logger.log(`method: ${method} args: ${args}`, context.name);
  }

  onMethodAfterInvoke(context: InvokeContext, method: string) {
    this.logger.log(
      `method: ${method} invoke-time: ${Date.now() - context.data.invokeAt}ms`,
      context.name,
    );
  }
}
