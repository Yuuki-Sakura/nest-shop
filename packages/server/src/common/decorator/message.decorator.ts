import { CUSTOM_SUCCESS_MESSAGE_METADATA } from '@adachi-sakura/nest-shop-common';
import { applyDecorators, SetMetadata } from '@nestjs/common';

/**
 * 自定义操作成功信息
 * @param successMessageKey
 */
export const Message = (successMessageKey: string) =>
  applyDecorators(
    SetMetadata(CUSTOM_SUCCESS_MESSAGE_METADATA, successMessageKey),
  );
