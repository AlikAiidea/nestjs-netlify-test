import { readFileSync } from 'fs'

import { Injectable } from '@nestjs/common'

/** Class containing reusable methods across the project */
@Injectable()
export class Helper {
  /**
   * Generates a random UUID.
   * @returns A randomly generated UUID.
   */
  static uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * Reads the content of a file synchronously.
   * @param  path - The path of the file to read.
   * @returns The content of the file as a string.
   */
  static readFileContent(path: string): string {
    return readFileSync(path, 'utf-8')
  }
}
