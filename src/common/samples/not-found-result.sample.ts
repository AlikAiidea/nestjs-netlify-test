import { IsNumber, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

/**
 * An HTTP 403 response code means that a client is forbidden from accessing a valid URL.
 * @version 1.0
 */
export class NotFoundResultSample {
  @ApiProperty({
    description: 'HTTP status code based on status and response result.',
    required: true,
    example: 404,
  })
  @IsNumber()
  statusCode = 404

  @ApiProperty({
    description: 'Optional, returns the reason for the error if not successful.',
    required: false,
    example: 'Not Found',
  })
  @IsOptional()
  error?: string | undefined = 'Not Found'

  @ApiProperty({
    description: 'The name associated with the response',
    required: true,
    example: 'NotFoundException',
  })
  @IsString()
  name = 'NotFoundException'

  @ApiProperty({
    description: 'The result of the response to be displayed to the user in clients.',
    required: true,
    example: 'Cannot GET /your/address',
  })
  @IsString()
  alert = 'Cannot GET /your/address'
}
