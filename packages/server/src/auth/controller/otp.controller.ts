import { Auth, User } from '@/auth/auth.utils';
import { OtpService } from '@/auth/service/otp.service';
import { Span } from '@/common/decorator/span.decorator';
import { warpResponse } from '@/common/utils/warp-response';
import { AuthEnableOtpStep2ResultDto } from '@/auth/dto/otp/auth-enable-otp-step-2-result.dto';
import { AuthEnableOtpStep2Dto } from '@/auth/dto/otp/auth-enable-otp-step-2.dto';
import { AuthEnableOtpStep1ResultDto } from '@/auth/dto/otp/auth-enable-otp-step-1-result.dto';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth/otp')
@Controller('auth/otp')
@Span()
export class OtpController {
  @Inject(OtpService)
  private readonly userService: OtpService;

  @Get('enable/step/1')
  @ApiOperation({
    summary: '开启otp第一步',
    operationId: 'user.otp.enable.step.1',
  })
  @ApiOkResponse({
    type: warpResponse({ type: AuthEnableOtpStep1ResultDto }),
  })
  @Auth()
  enableOtpStep1(@User() user: UserEntity) {
    return this.userService.enableOtpStep1(user);
  }

  @Post('enable/step/2')
  @ApiOperation({
    summary: '确认开启otp',
    operationId: 'user.otp.enable.step.2',
  })
  @ApiBody({
    type: AuthEnableOtpStep2Dto,
  })
  @ApiOkResponse({
    type: warpResponse({ type: AuthEnableOtpStep2ResultDto }),
  })
  @Auth()
  enableOtpStep2(@User() user: UserEntity, @Body() dto: AuthEnableOtpStep2Dto) {
    return this.userService.enableOtpStep2(user, dto);
  }
}
