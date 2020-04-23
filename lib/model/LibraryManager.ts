import TrackInfo from "./TrackInfo";

export default interface LibraryManager {
  /**
   * Load library metadata.
   */
  load(): Promise<void>

  /**
   * Try to find a similar track in the library
   * and return an object with the new properties added.
   */
  find(trackInfoStub: TrackInfo): Promise<TrackInfo|null>

  /**
   * Write track information into the matching library entry.
   */
  update(trackInfo: TrackInfo): Promise<void>
}