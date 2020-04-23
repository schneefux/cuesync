import TrackInfo from "../model/TrackInfo";
import { DjaySongEntry } from "./model/djay";
import Cue from "../model/Cue";
import TrackSerializer from "../model/TrackSerializer";
import DjaySongInfo from "./model/DjaySongInfo";
import { djayKeys } from "./model/djay"

export default class DjayTrackSerializer implements TrackSerializer<DjaySongInfo> {
  /**
   * Deserialize library entry to TrackInfo.
   */
  deserialize(songInfo: DjaySongInfo) {
    const [title, artists, duration] = songInfo.key.split('\t')
    const cues = (songInfo.value['song.cuePoints'] || [])
      .filter(c => c != 0)
      .map((seconds, index) => ({
        index,
        milliseconds: seconds * 1000
      } as Cue))

    const trackInfo = {
      title,
      artists: artists.split(', '),
      cues,
      durationSeconds: parseInt(duration),
    } as TrackInfo
    if ('song.manualBpm' in songInfo.value) {
      trackInfo.bpm = songInfo.value['song.manualBpm']
    }
    if ('song.songStart' in songInfo.value) {
      trackInfo.songStart = songInfo.value['song.songStart']
    }
    if ('song.manualKey' in songInfo.value) {
      trackInfo.key = djayKeys[songInfo.value['song.manualKey']]
    }

    return trackInfo
  }

  /**
   * Serialize TrackInfo to library entry.
   */
  serialize(trackInfo: TrackInfo) {
    const key = [trackInfo.title, trackInfo.artists.join(', '), trackInfo.durationSeconds].join('\t')
    const cueSecondsByIndex = trackInfo.cues.reduce((obj, cue) => ({ ...obj, [cue.index]: cue.milliseconds / 1000 }), {})
    const cuePoints = Array.from(Array(8))
      .map((e, index) => index in cueSecondsByIndex ? cueSecondsByIndex[index] : 0)
    const value = {
      'song.cuePoints': cuePoints,
    } as DjaySongEntry
    if (trackInfo.bpm !== undefined) {
      value['song.manualBpm'] = trackInfo.bpm
    }
    if (trackInfo.songStart !== undefined) {
      value['song.songStart'] = trackInfo.songStart
    }
    return { key, value }
  }
}