import LibraryManager from "./model/LibraryManager";
import TrackInfo from "./model/TrackInfo";
import SeratoLibraryManager from "./serato/SeratoLibraryManager";
import DjayLibraryManager from "./djay/DjayLibraryManager";
import FileLibraryManager from "./file/FileLibraryManager";

/**
 * User-facing library manager that unifies & syncs all libraries.
 */
export default class DelegatingLibraryManager implements LibraryManager {
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

  async find(trackInfoStub: TrackInfo) {
    if (this.djayLibraryManager) {
      trackInfoStub = await this.djayLibraryManager.find(trackInfoStub)
    }
    if (this.seratoLibraryManager) {
      trackInfoStub = await this.seratoLibraryManager.find(trackInfoStub)
    }
    if (trackInfoStub.filename !== undefined) {
      trackInfoStub = await this.fileLibraryManager.find(trackInfoStub)
    }
    return trackInfoStub
  }

  async update(trackInfo: TrackInfo) {
    throw new Error("Method not implemented.");
    return null
  }
}