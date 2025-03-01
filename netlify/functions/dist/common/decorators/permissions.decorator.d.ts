import { CustomDecorator } from '@nestjs/common';
export declare const Permissions: (...permissions: string[]) => CustomDecorator<string>;
