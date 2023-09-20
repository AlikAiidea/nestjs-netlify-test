import { Controller, Get } from '@nestjs/common'
import { ApiBasicAuth, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { Version } from './common/dto/version.dto'

/**
 * Controller for handling project-specific operations.
 */
@ApiTags('Version')
@ApiBasicAuth('API_ACCESS_TOKEN')
@ApiBearerAuth('AUTHORIZATION')
@Controller()
export class AppController {
  /**
   * Show version of the project
   * @returns project version
   */
  @ApiOperation({
    summary: 'Project version',
    description: `Displays the current version of the project`,
  })
  @ApiOkResponse({ type: Version })
  @Get()
  showVersion() {
    return { version: require('../package.json').version }
  }
}
