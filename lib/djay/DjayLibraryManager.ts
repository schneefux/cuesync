import { promisify } from "util";
import * as plist from "simple-plist"
import DjayLibrary from "./model/djay"
import DjayTrackSerializer from "./DjayTrackSerializer";
import LibraryManager from "../model/LibraryManager";
import TrackInfo from "../model/TrackInfo";
import { fuzzyTrackInfoEqual } from "../compare";

const plistRead = promisify(plist.readFile)
const plistWrite = promisify(plist.writeFile)

export default class DjayLibraryManager implements LibraryManager {
  tracks: TrackInfo[]
  serializer = new DjayTrackSerializer()

  constructor(public path: string) { }

  async load() {
    const library = await plistRead(this.path) as DjayLibrary
    const songEntries = [...Object.entries(library['Song Entries'])]
    this.tracks = songEntries.map(([key, value]) => this.serializer.deserialize({ key, value }))
  }

  async find(trackInfoStub: TrackInfo) {
    // TODO is it possible to read paths for local files?
    return this.tracks.find(t => fuzzyTrackInfoEqual(t, trackInfoStub))
  }

  async update(trackInfo: TrackInfo) {
    const index = this.tracks.findIndex(t => fuzzyTrackInfoEqual(t, trackInfo))
    this.tracks[index] = trackInfo

    const plist = {
      'Song Entries': {}
    }
    this.tracks.forEach(t => {
      const entry = this.serializer.serialize(t)
      plist['Song Entries'][entry.key] = entry.value
    })

    await plistWrite(this.path, plist)
  }
}