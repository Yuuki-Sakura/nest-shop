import { HttpException, HttpStatus } from '@nestjs/common';

export class CommonException extends HttpException {
  code?: number;
  constructor(response: string | Record<string, any>, code?: number) {
    super(response, HttpStatus.OK);
    this.code = code;
  }
}
