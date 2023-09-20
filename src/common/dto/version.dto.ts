import { ApiProperty } from '@nestjs/swagger'

export class Version {
  @ApiProperty({ example: '1.2.3' })
  version: string
}
