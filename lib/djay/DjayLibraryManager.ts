import { promisify } from "util";
import * as plist from "simple-plist"
import DjayLibrary from "./model/djay"
import DjayTrackSerializer from "./DjayTrackSerializer";
import LibraryManager from "../model/LibraryManager";
import TrackInfo from "../model/TrackInfo";

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
    // TODO write a proper distance function
    return this.tracks.find(t => t.title == trackInfoStub.title)
  }

  async update(trackInfo: TrackInfo) {
    // TODO
  }
}