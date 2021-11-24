import { HttpException, HttpStatus } from '@nestjs/common';

export interface CommonResponseMessage {
  key: string;
  args?: Record<string, any>;
}

export class CommonException extends HttpException {
  code?: number;
  constructor(response: CommonResponseMessage, code?: number) {
    super(response, HttpStatus.OK);
    this.code = code;
  }
}
