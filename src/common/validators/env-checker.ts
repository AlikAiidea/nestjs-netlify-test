import { config } from 'dotenv'
import { readFileSync } from 'fs'

import { Helper } from '../utils/helper'

config()

/**
 * Checks env and env.example file for similarity
 * @returns If keys in both file match returns true
 */
export function checkEnvKeys(): boolean {
  const envPath = '.env'
  const examplePath = '.env.example'

  const envContent = Helper.readFileContent(envPath)
  const exampleContent = Helper.readFileContent(examplePath)

  const envKeys = parseEnvKeys(envContent)
  const exampleKeys = parseEnvKeys(exampleContent)

  /** Check if keys match */
  const missingKeys = exampleKeys.filter((key) => !envKeys.includes(key))
  const extraKeys = envKeys.filter((key) => !exampleKeys.includes(key))

  if (missingKeys.length > 0 || extraKeys.length > 0) {
    console.error('Keys do not match:')
    if (missingKeys.length > 0) {
      console.error('Missing keys:', missingKeys)
    }
    if (extraKeys.length > 0) {
      console.info('Extra keys:', extraKeys)
    }
    return false
  }

  console.info('Keys match.')
  return true
}

/**
 * Checks if all keys from .env.example exist in the environment variables
 */
export function checkEnvExampleKeys(): void {
  const examplePath = '.env.example'

  /** Read .env.example file */
  const exampleContent = readFileSync(examplePath, 'utf-8')

  /** Get keys from .env.example */
  const exampleKeys = parseEnvKeys(exampleContent)

  /** Check if every key in .env.example exists in process.env */
  const missingKeys = exampleKeys.filter((key) => !(key in process.env))

  if (missingKeys.length > 0) {
    throw new Error(`Missing keys in process.env: ${missingKeys.join(', ')}`)
  }

  console.info('All keys from .env.example exist in the environment variables.')
}

/**
 * Parses environment variable keys from the provided content.
 * @param content env or env.example file
 * @returnsAn Array of parsed environment variable keys.
 */
function parseEnvKeys(content: string): string[] {
  /** Remove empty lines and comments from the content */
  const lines = content.split('\n').filter((line) => line.trim() !== '' && !line.startsWith('#'))

  /** Extract keys from lines */
  return lines.map((line) => {
    const keyValuePair = line.split('=')
    return keyValuePair[0].trim()
  })
}

/**
 * Sets the value of an environment variable and returns it.
 * @param envVar - The name of the environment variable.
 * @param  [defaultValue] - The default value to return if the environment variable is not defined.
 * @returns  The value of the environment variable or the defaultValue, if provided.
 */
export function setEnv(envVar: string, defaultValue?: string): string {
  if (!process.env[envVar]) {
    if (defaultValue) return defaultValue
    throw new Error(`Please define the Environment variable"${envVar}"`)
  } else return process.env[envVar] as string
}
