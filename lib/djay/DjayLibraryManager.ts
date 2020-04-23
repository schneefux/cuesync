import { promisify } from "util";
import * as plist from "simple-plist"
import DjayLibrary from "./model/djay"
import DjayTrackSerializer from "./DjayTrackSerializer";
import LibraryManager from "../model/LibraryManager";
import TrackInfo from "../model/TrackInfo";
import fuzzyTrackInfoEqual from "../compare";
import mergeTrackInfo from "../merge";

export default class DjayLibraryManager implements LibraryManager {
  tracks: TrackInfo[]
  serializer = new DjayTrackSerializer()

  constructor(public path: string) { }

  async load() {
    const library = await promisify(plist.readFile)(this.path) as DjayLibrary
    const songEntries = [...Object.entries(library['Song Entries'])]
    this.tracks = songEntries.map(([key, value]) => this.serializer.deserialize({ key, value }))
  }

  async find(trackInfoStub: TrackInfo) {
    const trackInfo = this.tracks.find(t => fuzzyTrackInfoEqual(t, trackInfoStub))
    return mergeTrackInfo(trackInfoStub, trackInfo)
  }

  async update(trackInfo: TrackInfo) {
    // TODO
  }
}