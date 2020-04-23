import TrackInfo from "./model/TrackInfo";
import SeratoLibraryManager from "./serato/SeratoLibraryManager";
import DjayLibraryManager from "./djay/DjayLibraryManager";
import FileLibraryManager from "./file/FileLibraryManager";
import mergeTrackInfo from "./merge";

/**
 * User-facing library manager that unifies access to all libraries.
 */
export default class Library {
  fileLibraryManager = new FileLibraryManager()

  constructor(
    public seratoLibraryManager?: SeratoLibraryManager,
    public djayLibraryManager?: DjayLibraryManager,
  ) { }

  async load() {
    if (this.seratoLibraryManager) {
      await this.seratoLibraryManager.load()
    }
    if (this.djayLibraryManager) {
      await this.djayLibraryManager.load()
    }
  }

  /**
   * Given a query, collect as much information as possible
   * from all available libraries.
   */
  async find(query: TrackInfo) {
    // djay only knows title, artist, cues, key
    const djayData = await this.djayLibraryManager?.find(query)
    query = mergeTrackInfo(query, djayData)
    // serato knows path, cues
    const seratoData = await this.seratoLibraryManager?.find(query)
    query = mergeTrackInfo(query, seratoData)
    // file knows title, artist, genre, key
    const fileData = await this.fileLibraryManager?.find(query)
    query = mergeTrackInfo(query, fileData)
    return query
  }

  async updateSerato(track: TrackInfo) {
    return this.seratoLibraryManager.update(track)
  }

  async updateDjay(track: TrackInfo) {
    return this.djayLibraryManager.update(track)
  }
}