import { UserLoginDto } from '@/user/dto';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/auth/auth.service';

@ApiTags('user')
@Controller('/user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('login')
  async login(@Body() loginDto: UserLoginDto) {
    return await this.userService.login(loginDto);
  }
}
