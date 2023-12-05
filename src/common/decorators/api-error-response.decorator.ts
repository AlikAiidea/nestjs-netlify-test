import { applyDecorators } from '@nestjs/common'
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { ForbiddenResultSample } from '../samples/forbidden-result.sample'
import { NotFoundResultSample } from '../samples/not-found-result.sample'
import { UnauthorizedResultSample } from '../samples/unauthorized-result.sample'

/**
 * Swagger api error response
 * to combine multiple common
 * error decorator and models
 * @returns Error swagger decorators all at once
 * @version 1.0
 */
export const ApiErrorResponse = () => {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'User authentication or authorization failed',
      type: UnauthorizedResultSample,
    }),
    ApiForbiddenResponse({
      description: 'User is forbidden from accessing the endpoint',
      type: ForbiddenResultSample,
    }),
    ApiNotFoundResponse({
      description: 'The server cannot find the requested ad',
      type: NotFoundResultSample,
    }),
  )
}
