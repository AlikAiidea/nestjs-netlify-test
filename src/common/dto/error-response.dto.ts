import { IsNumber, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

/**
 * Http error response DTO
 * @version 1.0
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Optional, returns the reason for the error if not successful.',
    required: true,
  })
  @IsOptional()
  error?: any | undefined

  @ApiProperty({
    description: 'Optional, returns the reason for the error if not successful.',
    required: true,
  })
  @IsOptional()
  name: string

  @ApiProperty({
    description: 'HTTP status code based on status and response result.',
    required: true,
  })
  @IsNumber()
  statusCode: number

  @ApiProperty({
    description: 'The result of the response to be displayed to the user in clients.',
    required: true,
  })
  @IsString()
  alert: string
}
