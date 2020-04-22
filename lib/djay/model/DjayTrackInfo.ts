import { DjaySongEntry } from "./djay";

export default class DjayTrackInfo {
  title: string
  artists: string[]
  duration: number
  cues: number[]
  bpmOverride: number
  songStart: number

  decode(meta: string, information: DjaySongEntry) {
    const [title, artists, duration] = meta.split('\t')
    this.title = title
    this.artists = artists.split(', ')
    this.duration = parseInt(duration)
    this.cues = (information['song.cuePoints'] || []).filter(c => c != 0)
    this.bpmOverride = information['song.manualBpm']
    this.songStart = information['song.songStart']
  }

  encode() {
    const meta = [this.title, this.artists.join(', '), this.duration].join('\t')
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
}