import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommonService {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
}
