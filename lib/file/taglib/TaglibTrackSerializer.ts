import TrackSerializer from "../../model/TrackSerializer"
import TaglibInfo from "./model/taglib"
import TrackInfo from "../../model/TrackInfo"

export default class TaglibTrackSerializer implements TrackSerializer<TaglibInfo> {
  deserialize(info: TaglibInfo) {
    const trackInfo = {} as TrackInfo
    trackInfo.album = info.ALBUM?.[0]
    trackInfo.title = info.TITLE?.[0]
    trackInfo.artists = info.ARTIST?.[0]?.split(',').map(s => s.trim())
    trackInfo.bpm = parseInt(info.BPM?.[0]) || undefined
    trackInfo.genre = info.GENRE?.[0]
    trackInfo.key = info.INITIALKEY?.[0]
    trackInfo.isrc = info.ISRC?.[0]
    return trackInfo
  }

  serialize(trackInfo: TrackInfo): TaglibInfo {
    const tags = {} as TaglibInfo
    if (trackInfo.album) {
      tags.ALBUM = [trackInfo.album]
    }
    if (trackInfo.title) {
      tags.TITLE = [trackInfo.title]
    }
    if (trackInfo.artists) {
      tags.ARTIST = [trackInfo.artists.join(', ')]
    }
    if (trackInfo.bpm) {
      tags.BPM = [trackInfo.bpm.toString()]
    }
    if (trackInfo.genre) {
      tags.GENRE = [trackInfo.genre]
    }
    if (trackInfo.key) {
      tags.INITIALKEY = [trackInfo.key]
    }
    if (trackInfo.isrc) {
      tags.ISRC = [trackInfo.isrc]
    }

    return tags
  }
}