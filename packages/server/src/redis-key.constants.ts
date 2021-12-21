import { UserEntity } from '@adachi-sakura/nest-shop-entity';

const prefix = 'nest-shop:';

export namespace RedisKey {
  export namespace Auth {
    export namespace OTP {
      export const Info = (token: string) => prefix + `auth:otp:${token}`;
    }

    export const ExpiredToken = prefix + 'auth:expired-token';

    export const LoginFailCount = (user: UserEntity) =>
      prefix + `auth:${user.id}:login-fail-count`;

    export const LoginLock = (user: UserEntity) =>
      prefix + `auth:${user.id}:login-lock`;
  }

  export namespace User {
    export const Permissions = (user: UserEntity) =>
      prefix + `user:${user.id}:permissions`;
  }
}
