import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
export declare class NatsLoggerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Promise<any>;
}
