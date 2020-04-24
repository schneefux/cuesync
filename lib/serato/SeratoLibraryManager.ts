import { promisify } from "util"
import * as taglib from 'taglib3'
import SeratoTrackSerializer, { FrameMap } from "./SeratoTrackSerializer"
import LibraryManager from "../model/LibraryManager"
import * as seratojs from 'seratojs'
import * as path from 'path'
import TrackInfo from "../model/TrackInfo"
import TaglibInfo, { TaglibId3Info } from "../file/taglib/model/taglib"
import { fuzzyTrackInfoMatchesPath } from "../compare"

// TODO replace seratojs by own implementation
// or try https://github.com/Rickgg/serato-crater

const readId3Tags = promisify(taglib.readId3Tags)
const writeId3Tags = promisify(taglib.writeId3Tags)
const readTaglibTags = promisify(taglib.readTags)
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
    let frames: FrameMap
    if (path.endsWith('.mp3')) {
      // taglib id3 dumps the whole frame, including the GEOB id
      const info = await readId3Tags(path) as TaglibId3Info
      const geobHeaderLength = 11 // TODO fix this upstream, make it smart or look up a reference for this value
      frames = [...Object.entries(info)]
        .filter(([name, value]) => name.toLowerCase().startsWith('serato'))
        .reduce((obj, [name, value]) => ({ ...obj, [name]: Buffer.from(value, 'base64').slice(geobHeaderLength) }), {})
      console.log(frames['Serato Markers2'].toString('base64'))
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
  async writeSeratoData(trackPath: string, trackInfo: TrackInfo) {
    const tags = this.serializer.serialize(trackInfo)

    if (trackPath.endsWith('.mp3')) {
      // FIXME id3 write format is != id3 read format:
      //  * write is base64(object)
      //  * read is raw frame (header + id + mime type + object)

      console.log('before', (await readId3Tags(trackPath)))
      // TODO this is ugly - call encoder directly instead, skipping frame encoder
      const buffer = tags['Serato Markers2'].slice('application/octet-stream\x00\x00Serato Markers2\x00'.length)
      await writeId3Tags(trackPath, {
        'Serato Markers2': buffer.toString('base64'),
      })
    } else {
      // VORBIS COMMENT but has newlines every 72 characters
      // split with \n every 72 chars
      await writeTaglibTags(trackPath, {
        SERATO_MARKERS_V2: [tags['Serato Markers2'].toString('base64').replace(/(.{72})/g, '$1\n')],
      })
    }
  }
}