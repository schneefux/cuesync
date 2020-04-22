import { promisify } from "util"
import * as taglib from 'taglib3'
import readId3Tags from "../id3"
import SeratoTrackSerializer from "./SeratoTrackSerializer"
import LibraryManager from "../model/LibraryManager"
import * as seratojs from 'seratojs'
import * as path from 'path'
import TrackInfo from "../model/TrackInfo"

// TODO replace seratojs by own implementation

const readTags = promisify(taglib.readTags)

export default class SeratoLibraryManager implements LibraryManager {
  tracks: TrackInfo[]
  serializer = new SeratoTrackSerializer()

  constructor(public cratesPath: string) { }

  async load() {
    this.tracks = []
    const crates = await seratojs.listCrates(this.cratesPath)
    for (const crate of crates) {
      const songPaths = await crate.getSongPaths()
      for (const songPath of songPaths) {
        const filename = path.basename(songPath)
        // FIXME temporary workaround for song path (bug in serato-js)
        this.tracks.push({ path: songPath.replace(/^P/, 'M'), filename })
      }
    }
  }

  async find(trackInfo: TrackInfo) {
    const track = this.tracks.find(t => t.filename.includes(trackInfo.title))
    const seratoData = await this.readGeobFrames(track.path)
    return {
      ...track,
      ...seratoData,
    }
  }

  async update(trackInfo: TrackInfo) {
    // TODO
  }

  /**
   * Read Serato meta data from an audio file.
   */
  async readGeobFrames(path) {
    const tags = (path.endsWith('.mp3') ? await readId3Tags(path) : await readTags(path))as { [name: string]: string[] }
    const mimetype = Buffer.from('application/octet-stream').toString('base64')

    const geobFrames = tags.GEOB || [...Object.entries(tags)]
      .filter(([name, value]) => name.startsWith('SERATO_') && value.length == 1 && value[0].startsWith(mimetype))
      .map(([name, value]) => value[0])

    const frames = geobFrames.map(data => Buffer.from(data, 'base64'))
    return this.serializer.deserialize(frames)
  }
}