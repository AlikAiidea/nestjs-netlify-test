import { IsNumber, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

/**
 * The response model to the lack of access to the desired web service
 * due to non-authentication of the user by existing methods
 * such as not sending an access token or its validity has expired.
 * @version 1.0
 */
export class UnauthorizedResultSample {
  @ApiProperty({
    description: 'HTTP status code based on status and response result.',
    required: true,
    example: 401,
  })
  @IsNumber()
  statusCode = 401

  @ApiProperty({
    description: 'Optional, returns the reason for the error if not successful.',
    required: false,
    example: 'The token is not valid or expired!',
  })
  @IsOptional()
  error?: string | undefined = 'The token is not valid or expired!'

  @ApiProperty({
    description: 'The name associated with the response',
    required: true,
    example: 'HttpException',
  })
  @IsString()
  name = 'HttpException'

  @ApiProperty({
    description: 'The result of the response to be displayed to the user in clients.',
    required: true,
    example: 'The token is not valid or expired!',
  })
  @IsString()
  alert = 'The token is not valid or expired!'
}
