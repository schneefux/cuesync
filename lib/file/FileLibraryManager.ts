import * as id3 from 'id3-rs'
import * as taglib from 'taglib3'
import { promisify } from 'util'
import LibraryManager from '../model/LibraryManager'
import Id3TrackSerializer from './id3/Id3TrackSerializer'
import TaglibTrackSerializer from './taglib/TaglibTrackSerializer'
import TrackInfo from '../model/TrackInfo'

export default class FileLibraryManager implements LibraryManager {
  id3Serializer = new Id3TrackSerializer()
  taglibSerializer = new TaglibTrackSerializer()
  private tagCache = {} as { [path: string]: TrackInfo }

  async load() {
    throw new Error("Method not implemented.");
  }

  /**
   * Extend track info with file meta data.
   */
  async find(stub: TrackInfo) {
    // TODO optionally scan file system for file?
    if (stub.path == undefined) {
      return null
    }

    if (stub.path in this.tagCache) {
      return this.tagCache[stub.path]
    }

    let trackInfo: TrackInfo

    if (stub.path.endsWith('.mp3')) {
      const tags = await promisify(id3.readTags)(stub.path)
      trackInfo = this.id3Serializer.deserialize(tags)
    } else {
      const tags = await promisify(taglib.readTags)(stub.path)
      trackInfo = this.taglibSerializer.deserialize(tags)
    }

    this.tagCache[stub.path] = trackInfo
    return trackInfo
  }

  async update(trackInfo: TrackInfo) {
    throw new Error("Method not implemented.");
  }
}