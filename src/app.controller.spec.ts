import { Test, TestingModule } from '@nestjs/testing'

import { AppController } from './app.controller'

describe('AppController', () => {
  let controller: AppController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile()

    controller = module.get<AppController>(AppController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('showVersion', () => {
    it('should return the project version', () => {
      const expectedVersion = require('../package.json').version
      const result = controller.showVersion()
      expect(result).toEqual({ version: expectedVersion })
    })
  })
})
