import { IsNumber, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

/**
 * An HTTP 403 response code means that a client is forbidden from accessing a valid URL.
 * @version 1.0
 */
export class ForbiddenResultSample {
  @ApiProperty({
    description: 'HTTP status code based on status and response result.',
    required: true,
    example: 403,
  })
  @IsNumber()
  statusCode = 403

  @ApiProperty({
    description: 'Optional, returns the reason for the error if not successful.',
    required: false,
    example: 'Forbidden',
  })
  @IsOptional()
  error?: string | undefined = 'Forbidden'

  @ApiProperty({
    description: 'The message associated with the response',
    required: true,
    example: 'Forbidden',
  })
  @IsString()
  name = 'Forbidden'

  @ApiProperty({
    description: 'The result of the response to be displayed to the user in clients.',
    required: true,
    example: 'Forbidden resource',
  })
  @IsString()
  alert = 'Forbidden resource'
}
