import * as fs from 'fs'
import * as path from 'path'
import * as globCb from 'glob'
import { promisify } from 'util'

const glob = promisify(globCb as any)

// based on https://github.com/MartinHH/CrateToM3U/blob/master/src/main/scala/io/github/martinhh/sl/CrateExtractor.scala
export default class SeratoCrateReader {
  /**
   * Find all crates under the given root path.
   */
  async listCrates(root: string) {
    const crates = await glob('**/_Serato_/Subcrates/*.crate', {
      cwd: root,
      silent: true,
      strict: false,
    })
    return crates.map(c => path.join(root, c))
  }

  /**
   * List songs in a crate file.
   */
  async listSongs(filePath: string) {
    const ptrk = Buffer.from('ptrk')

    let buf = await fs.promises.readFile(filePath)
    let paths = [] as string[]

    while (true) {
      // 'ptrk'
      const start = buf.indexOf(ptrk)

      if (start == -1) {
        break
      }

      // 4 byte length
      buf = buf.slice(start + ptrk.length)
      const len = buf.readUInt32BE(0)
      buf = buf.slice(4)

      // utf16 BE file name
      const song = buf.slice(0, len)
        .swap16()
        .toString('utf16le')
      // go from crate path to root, then append song
      paths.push(path.resolve(filePath, '/', song))

      buf = buf.slice(len)
    }

    return paths
  }
}
