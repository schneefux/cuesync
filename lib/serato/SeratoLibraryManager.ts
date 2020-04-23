import { promisify } from "util"
import * as taglib from 'taglib3'
import * as id3 from 'id3-rs'
import SeratoTrackSerializer, { FrameMap } from "./SeratoTrackSerializer"
import LibraryManager from "../model/LibraryManager"
import * as seratojs from 'seratojs'
import * as path from 'path'
import TrackInfo from "../model/TrackInfo"
import Id3Frame from "../file/id3/model/id3-rs"
import TaglibInfo from "../file/taglib/model/taglib"
import { fuzzyTrackInfoMatchesPath } from "../compare"

// TODO replace seratojs by own implementation
// or try https://github.com/Rickgg/serato-crater

const readTaglibTags = promisify(taglib.readTags)
const readId3Tags = promisify(id3.readTags)
const writeTaglibTags = promisify(taglib.writeTags)

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
    const info = await this.readSeratoData(trackPath)
    return {
      filename,
      path: trackPath,
      ...info,
    }
  }

  async update(trackInfo: TrackInfo) {
    this.writeSeratoData(trackInfo.path, trackInfo)
  }

  /**
   * Read Serato meta data from an audio file.
   */
  async readSeratoData(path: string) {
    // TODO avoid duplicate file access in FileLibraryManager and here
    let frames: FrameMap
    if (path.endsWith('.mp3')) {
      const tags = await readId3Tags(path) as Id3Frame[]
      frames = tags
        .filter(t => t.id == 'GEOB')
        .reduce((obj, t, index) => ({ ...obj, [index]: Buffer.from(t.data, 'base64') }), {})
    } else {
      const mimetype = Buffer.from('application/octet-stream').toString('base64')
      const info = await readTaglibTags(path) as TaglibInfo
      frames = [...Object.entries(info)]
        .filter(([name, value]) => name.startsWith('SERATO_') && value.length == 1 && value[0].startsWith(mimetype))
        .reduce((obj, [name, value]) => ({ ...obj, [name]: Buffer.from(value[0], 'base64') }), {})
    }

    return this.serializer.deserialize(frames)
  }

  /**
   * Write Serato meta data to an audio file.
   */
  async writeSeratoData(path: string, trackInfo: TrackInfo) {
    const tags = this.serializer.serialize(trackInfo)

    if (path.endsWith('.mp3')) {
      const buffers = this.serializer.serialize(trackInfo)
      const tags = await readId3Tags(path) as Id3Frame[]
      console.log(tags)
      throw Error('Not implemented')
      // TODO decode base64 and add \x00 byte to beginning (= encoding of geob container)
    } else {
      // split with \n every 72 chars
      taglib.writeTagsSync(path, {
        SERATO_MARKERS_V2: [tags['Serato Markers2'].toString('base64').replace(/(.{72})/g, '$1\n')],
      })
      // TODO fix 'Could not parse file' in upstream implementation for async
      /*
      await writeTaglibTags(path, {
        // SERATO_MARKERS_V2: [tags['Serato Markers2'].toString('base64').replace(/(.{72})/g, '$1\n')],
      })
      */
    }
  }
}