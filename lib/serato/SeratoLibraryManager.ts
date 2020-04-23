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
import fuzzyTrackInfoEqual from "../compare"
import mergeTrackInfo from "../merge"

// TODO replace seratojs by own implementation

const readTaglibTags = promisify(taglib.readTags)
const readId3Tags = promisify(id3.readTags)

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
    const track = this.tracks.find(t => fuzzyTrackInfoEqual(t, trackInfo))
    if (track !== undefined) {
      trackInfo = mergeTrackInfo(trackInfo, track)
    }

    // TODO optionally scan file system?
    if (trackInfo.path == undefined) {
      return trackInfo
    }

    const seratoData = await this.readGeobFrames(trackInfo.path)
    return mergeTrackInfo(trackInfo, seratoData)
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