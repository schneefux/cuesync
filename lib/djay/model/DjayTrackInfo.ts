import { DjaySongEntry } from "./djay";

export default class DjayTrackInfo {
  title: string
  artists: string[]
  unknownNumber: number
  cues: number[]
  bpmOverride: number
  songStart: number

  decode(meta: string, information: DjaySongEntry) {
    const [title, artists, unknownNumber] = meta.split('\t')
    this.title = title
    this.artists = artists.split(',')
    this.unknownNumber = parseInt(unknownNumber)
    this.cues = information['song.cuePoints'] || []
    this.bpmOverride = information['song.manualBpm']
    this.songStart = information['song.songStart']
  }
}