import * as id3 from 'id3-rs'
import * as taglib from 'taglib3'
import { promisify } from 'util'
import LibraryManager from '../model/LibraryManager'
import Id3TrackSerializer from './id3/Id3TrackSerializer'
import TaglibTrackSerializer from './taglib/TaglibTrackSerializer'
import TrackInfo from '../model/TrackInfo'
import mergeTrackInfo from '../merge'

export default class FileLibraryManager implements LibraryManager {
  id3Serializer = new Id3TrackSerializer()
  taglibSerializer = new TaglibTrackSerializer()

  async load() {
    throw new Error("Method not implemented.");
  }

  /**
   * Extend track info with file meta data.
   */
  async find(trackInfoStub: TrackInfo) {
    // TODO optionally scan file system for file?
    if (trackInfoStub.filename == undefined) {
      return trackInfoStub
    }

    let trackInfo: TrackInfo

    if (trackInfoStub.filename.endsWith('.mp3')) {
      const tags = await promisify(id3.readTags)(trackInfoStub.path)
      trackInfo = this.id3Serializer.deserialize(tags)
    } else {
      const tags = await promisify(taglib.readTags)(trackInfoStub.path)
      trackInfo = this.taglibSerializer.deserialize(tags)
    }

    return mergeTrackInfo(trackInfoStub, trackInfo)
  }

  async update(trackInfo: TrackInfo) {
    throw new Error("Method not implemented.");
  }
}