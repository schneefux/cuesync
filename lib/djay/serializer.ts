import TrackInfo from "../model/TrackInfo";
import { DjaySongEntry } from "./model/djay";
import Cue from "../model/Cue";

export function deserialize(meta: string, information: DjaySongEntry) {
  const [title, artistsStr, duration] = meta.split('\t')
  const artists = artistsStr.split(', ')
  const cues = (information['song.cuePoints'] || [])
    .filter(c => c != 0)
    .map((seconds, index) => ({
      index,
      milliseconds: seconds * 1000
    } as Cue))
  const bpm = information['song.manualBpm']
  const songStart = information['song.songStart']

  return {
    title,
    artists,
    cues,
    bpm,
    songStart,
  } as TrackInfo
}

export function serialize(trackInfo: TrackInfo) {
  const meta = [trackInfo.title, trackInfo.artists.join(', '), trackInfo.durationSeconds].join('\t')
  const cueSecondsByIndex = trackInfo.cues.reduce((obj, cue) => ({ ...obj, [cue.index]: cue.milliseconds / 1000 }), {})
  const cuePoints = Array.from(Array(8))
    .map((e, index) => index in cueSecondsByIndex ? cueSecondsByIndex[index] : 0)
  const information = {
    'song.cuePoints': cuePoints,
  } as DjaySongEntry
  if (this.bpmOverride !== undefined) {
    information['song.manualBpm'] = this.bpmOverride
  }
  if (this.songStart !== undefined) {
    information['song.songStart'] = this.songStart
  }
  return { meta, information }
}