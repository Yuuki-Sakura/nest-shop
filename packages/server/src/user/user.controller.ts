import { Auth } from '@/auth/auth.utils';
import { Span } from '@/common/decorator/span.decorator';
import { Message } from '@/common/decorator/message.decorator';
import { UserLoginDto, UserLoginResultDto, UserRegisterDto } from '@/user/dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/auth/auth.service';
import { Request } from 'express';

@ApiTags('user')
@Controller('/user')
@Span()
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('login')
  @ApiBody({ type: UserLoginDto })
  async login(@Body() loginDto: UserLoginDto, @Req() req: Request) {
    return await this.userService.login(loginDto, req);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @Message('user.register.success')
  async register(@Body() registerDto: UserRegisterDto) {
    return this.userService.register(registerDto);
  }

  @Auth('user.test', '测试')
  @Get()
  test() {
    return 'test';
  }
}
