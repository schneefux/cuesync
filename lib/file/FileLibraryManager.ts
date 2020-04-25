import * as taglib from 'taglib3'
import { promisify } from 'util'
import LibraryManager from '../model/LibraryManager'
import TaglibTrackSerializer from './taglib/TaglibTrackSerializer'
import TrackInfo from '../model/TrackInfo'
import TaglibInfo from './taglib/model/taglib'

const readTags = promisify(taglib.readTags)
const writeTags = promisify(taglib.writeTags)

export default class FileLibraryManager implements LibraryManager {
  serializer = new TaglibTrackSerializer()
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

    const tags = await readTags(stub.path) as TaglibInfo
    const trackInfo = this.serializer.deserialize(tags)

    this.tagCache[stub.path] = trackInfo
    return trackInfo
  }

  async update(trackInfo: TrackInfo) {
    const path = trackInfo.path

    if (path == undefined) {
      return
    }

    if (path in this.tagCache) {
      delete this.tagCache[path]
    }

    const tags = this.serializer.serialize(trackInfo)
    await writeTags(path, tags)
  }
}