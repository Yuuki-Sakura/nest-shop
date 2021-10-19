import { Controller } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/auth/auth.service';

@ApiTags('account')
@Controller('/account')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
}
