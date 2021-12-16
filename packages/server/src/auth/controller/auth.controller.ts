import { Auth, Token } from '@/auth/auth.utils';
import { AuthPermissionDto } from '@/auth/dto/auth-permission.dto';
import { AuthRoleDto } from '@/auth/dto/auth-role.dto';
import { AuthSendVerifyDto } from '@/auth/dto/auth-send-verify.dto';
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
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/auth/service/auth.service';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
@Span()
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('login')
  @ApiOperation({
    summary: '登录',
    operationId: 'auth.login',
  })
  @ApiBody({ type: AuthLoginDto })
  @ApiOkResponse({ type: warpResponse({ type: AuthLoginResultDto }) })
  async login(@Body() loginDto: AuthLoginDto, @Req() req: Request) {
    return await this.authService.login(loginDto, req);
  }

  @Post('register')
  @ApiOperation({
    summary: '注册',
    operationId: 'auth.register',
  })
  @HttpCode(HttpStatus.OK)
  @Message('auth.register.success')
  @ApiOkResponse({
    type: warpResponse({ type: AuthLoginResultDto, nullable: true }),
  })
  @ApiBody({
    type: AuthRegisterDto,
  })
  async register(@Body() registerDto: AuthRegisterDto, @Req() req: Request) {
    return this.authService.register(registerDto, req);
  }

  @Post('logout')
  @ApiOperation({
    summary: '登出',
    operationId: 'auth.logout',
  })
  @Message('auth.logout.success')
  @Auth()
  logout(@Token() token: string) {
    return this.authService.logout(token);
  }

  @Post('refresh')
  @ApiOperation({
    summary: '刷新状态',
    operationId: 'auth.refresh',
  })
  @Message('auth.refresh.success')
  @ApiOkResponse({
    type: warpResponse({ type: AuthRefreshResultDto, nullable: true }),
  })
  @Auth()
  refresh(@Token() token: string) {
    return this.authService.refresh(token);
  }

  @Get('sendVerify')
  sendVerify(@Query() dto: AuthSendVerifyDto) {}

  @Post('permission')
  @ApiOperation({
    summary: '授予权限',
    operationId: 'auth.permission',
  })
  @Message('auth.permission.success')
  @Auth('auth.permission', '授予权限')
  @ApiBody({
    type: AuthPermissionDto,
  })
  permission(@Body() dto: AuthPermissionDto) {
    return this.authService.permission(dto);
  }

  @Post('role')
  @ApiOperation({
    summary: '授予角色',
    operationId: 'auth.role',
  })
  @Message('auth.role.success')
  @Auth('auth.role', '授予角色')
  @ApiBody({
    type: AuthRoleDto,
  })
  role(@Body() dto: AuthRoleDto) {
    return this.authService.role(dto);
  }
}
