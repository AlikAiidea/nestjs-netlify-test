import { readFileSync } from 'fs'

import { Helper } from '../utils/helper'
import { checkEnvExampleKeys, checkEnvKeys, setEnv } from './env-checker'

const mockReadFileContent = jest.fn()

jest.mock('fs')
const mockReadFileSync = readFileSync as jest.Mock

describe('env checker', () => {
  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(jest.fn())
    jest.spyOn(console, 'error').mockImplementation(jest.fn())
  })

  describe('checkEnvKeys', () => {
    it('should return true if there is no difference', () => {
      mockReadFileContent.mockImplementation((filename: string) => {
        return 'KEY'
      })
      Helper.readFileContent = mockReadFileContent
      expect(checkEnvKeys()).toEqual(true)
    })

    it('should return false if a key is missing', () => {
      mockReadFileContent.mockImplementation((filename: string) => {
        return filename == '.env' ? '' : 'KEY'
      })
      Helper.readFileContent = mockReadFileContent
      expect(checkEnvKeys()).toEqual(false)
    })

    it('should return false if there is extra key', () => {
      mockReadFileContent.mockImplementation((filename: string) => {
        return filename == '.env' ? 'KEY' : ''
      })
      Helper.readFileContent = mockReadFileContent
      expect(checkEnvKeys()).toEqual(false)
    })
  })

  describe('checkEnvExampleKeys', () => {
    it('should throw error if keys missing', () => {
      mockReadFileSync.mockReset()
      const examplePath = '.env.example'
      const fakeContent = 'KEY1=example\nKEY2=example\nKEY3=example\n'

      mockReadFileSync.mockReturnValue(fakeContent)

      expect(() => checkEnvExampleKeys()).toThrowError('Missing keys in process.env: KEY1, KEY2, KEY3')

      expect(mockReadFileSync).toHaveBeenCalledWith(examplePath, 'utf-8')
    })

    it('should not throw an error if all keys are present', () => {
      const examplePath = '.env.example'
      const fakeContent = ''

      mockReadFileSync.mockReturnValue(fakeContent)

      expect(() => checkEnvExampleKeys()).not.toThrow()

      expect(mockReadFileSync).toHaveBeenCalledWith(examplePath, 'utf-8')
    })
  })

  describe('setEnv', () => {
    beforeEach(() => {
      process.env = {} // Reset process.env before each test
    })
    it('should return the value of the environment variable if it exists', () => {
      const envVar = 'MY_ENV_VAR'
      const expectedValue = 'my-value'
      process.env[envVar] = expectedValue

      const result = setEnv(envVar)

      expect(result).toEqual(expectedValue)
    })

    it('should return the default value if the environment variable is not defined and a default value is provided', () => {
      const envVar = 'MY_ENV_VAR'
      const defaultValue = 'default-value'

      const result = setEnv(envVar, defaultValue)

      expect(result).toEqual(defaultValue)
    })

    it('should throw an error if the environment variable is not defined and no default value is provided', () => {
      const envVar = 'MY_ENV_VAR'
      expect(() => {
        setEnv(envVar)
      }).toThrowError()
    })
  })
})
