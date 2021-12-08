import { AuthService } from '@/auth/auth.service';
import { Auth, Token } from '@/auth/auth.utils';
import {
  AuthLoginDto,
  AuthLoginResultDto,
  AuthRefreshResultDto,
  AuthRegisterDto,
} from '@/auth/dto';
import { Span } from '@/common/decorator/span.decorator';
import { Inject } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';

@Resolver(() => AuthLoginResultDto)
@Span()
export class AuthResolver {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Mutation(() => AuthLoginResultDto)
  login(@Args('input') loginDto: AuthLoginDto, @Context() context) {
    return this.authService.login(loginDto, context.req);
  }

  @Mutation(() => AuthLoginResultDto, { nullable: true })
  register(@Args('input') registerDto: AuthRegisterDto, @Context() context) {
    return this.authService.register(registerDto, context.req);
  }

  @Mutation(() => GraphQLString, { nullable: true })
  @Auth()
  logout(@Token() token: string) {
    return this.authService.logout(token);
  }

  @Mutation(() => AuthRefreshResultDto, { nullable: true })
  @Auth()
  refresh(@Token() token: string) {
    return this.authService.refresh(token);
  }
}
