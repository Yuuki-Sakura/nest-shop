import { Auth, Token, User } from '@/auth/auth.utils';
import { Span } from '@/common/decorator/span.decorator';
import { Message } from '@/common/decorator/message.decorator';
import { warpResponse } from '@/common/utils/warp-response';
import {
  AuthLoginDto,
  AuthLoginResultDto,
  AuthRefreshResultDto,
  AuthRegisterDto,
} from '@/auth/dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/auth/auth.service';
import { Request } from 'express';

@ApiTags('认证')
@Controller('/auth')
@Span()
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('login')
  @ApiBody({ type: AuthLoginDto })
  @ApiResponse({ type: warpResponse({ type: AuthLoginResultDto }) })
  async login(@Body() loginDto: AuthLoginDto, @Req() req: Request) {
    return await this.authService.login(loginDto, req);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @Message('auth.register.success')
  @ApiResponse({
    type: warpResponse({ type: AuthLoginResultDto, nullable: true }),
  })
  @ApiBody({
    type: AuthRegisterDto,
  })
  async register(@Body() registerDto: AuthRegisterDto, @Req() req: Request) {
    return this.authService.register(registerDto, req);
  }

  @Post('logout')
  @Message('auth.logout.success')
  @Auth()
  logout(@Token() token: string) {
    return this.authService.logout(token);
  }

  @Post('refresh')
  @Message('auth.logout.success')
  @ApiResponse({
    type: warpResponse({ type: AuthRefreshResultDto, nullable: true }),
  })
  @Auth()
  refresh(@Token() token: string) {
    return this.authService.refresh(token);
  }
}
