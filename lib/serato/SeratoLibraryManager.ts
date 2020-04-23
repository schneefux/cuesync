import { promisify } from "util"
import * as taglib from 'taglib3'
import * as id3 from 'id3-rs'
import SeratoTrackSerializer from "./SeratoTrackSerializer"
import LibraryManager from "../model/LibraryManager"
import * as seratojs from 'seratojs'
import * as path from 'path'
import TrackInfo from "../model/TrackInfo"
import Id3Frame from "../file/id3/model/id3-rs"
import TaglibInfo from "../file/taglib/model/taglib"
import fuzzyTrackInfoEqual, { fuzzyTrackInfoMatchesPath } from "../compare"
import mergeTrackInfo from "../merge"

// TODO replace seratojs by own implementation
// or try https://github.com/Rickgg/serato-crater

const readTaglibTags = promisify(taglib.readTags)
const readId3Tags = promisify(id3.readTags)

export default class SeratoLibraryManager implements LibraryManager {
  filePaths: string[]
  serializer = new SeratoTrackSerializer()

  constructor(public cratesPath: string) { }

  async load() {
    this.filePaths = []
    const crates = await seratojs.listCrates(this.cratesPath)
    for (const crate of crates) {
      const songPaths = await crate.getSongPaths()
      for (const songPath of songPaths) {
        // TODO maybe scan all files if performance isn't too bad?
        // FIXME temporary workaround for song path (bug in serato-js)
        this.filePaths.push(songPath.replace(/^P/, 'M'))
      }
    }
  }

  /**
   * Try to look up the file's path if it is unknown.
   * If a path is known, read Serato file data.
   */
  async find(trackInfo: TrackInfo) {
    const trackPath = trackInfo.path || this.filePaths.find(p => fuzzyTrackInfoMatchesPath(trackInfo, p))

    if (trackPath == undefined) {
      return {}
    }

    const filename = path.basename(trackPath)
    const data = await this.readGeobFrames(trackPath)
    return {
      filename,
      path: trackPath,
      ...data,
    }
  }

  async update(trackInfo: TrackInfo) {
    // TODO
  }

  /**
   * Read Serato meta data from an audio file.
   */
  async readGeobFrames(path) {
    // TODO avoid duplicate file access in FileLibraryManager and here
    let frames: string[]
    if (path.endsWith('.mp3')) {
      const tags = await readId3Tags(path) as Id3Frame[]
      frames = tags
        .filter(t => t.id == 'GEOB')
        .map(t => t.data)
    } else {
      const mimetype = Buffer.from('application/octet-stream').toString('base64')
      const info = await readTaglibTags(path) as TaglibInfo
      frames = [...Object.entries(info)]
        .filter(([name, value]) => name.startsWith('SERATO_') && value.length == 1 && value[0].startsWith(mimetype))
        .map(([name, value]) => value[0])
    }

    const buffers = frames.map(f => Buffer.from(f, 'base64'))
    return this.serializer.deserialize(buffers)
  }
}