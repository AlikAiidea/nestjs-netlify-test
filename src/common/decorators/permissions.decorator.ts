import { CustomDecorator, SetMetadata } from '@nestjs/common'

export const Permissions = (...permissions: string[]): CustomDecorator<string> => {
  return SetMetadata('permissions', permissions)
}
