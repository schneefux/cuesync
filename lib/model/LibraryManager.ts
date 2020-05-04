import TrackInfo from "./TrackInfo";

export default interface LibraryManager {
  /**
   * Load library metadata into memory.
   */
  load(): Promise<void>

  /**
   * Return all tracks from memory.
   */
  list(): TrackInfo[]

  /**
   * Return a list of all supported TrackInfo keys.
   */
  attributes(): (keyof TrackInfo)[]

  /**
   * Search a similar track from memory
   * and load additional attributes if available.
   */
  find(trackInfoStub: TrackInfo): TrackInfo|null

  /**
   * Write track information into the matching library entry.
   */
  update(trackInfo: TrackInfo): Promise<void>
}
