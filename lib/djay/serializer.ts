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
  const information = {
    'song.cuePoints': Array.from(Array(8)).map((e, index) => index < this.cues.length ? this.cues[index] : 0),
  } as DjaySongEntry
  if (this.bpmOverride !== undefined) {
    information['song.manualBpm'] = this.bpmOverride
  }
  if (this.songStart !== undefined) {
    information['song.songStart'] = this.songStart
  }
  return { meta, information }
}