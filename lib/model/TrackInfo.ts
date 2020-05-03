import Cue from "./Cue";

export default interface TrackInfo {
  title?: string
  album?: string
  artists?: string[]
  cues?: Cue[]
  bpm?: number
  bpmLock?: boolean
  color?: string
  durationSeconds?: number
  songStart?: number
  path?: string
  filename?: string
  isrc?: string
  key?: string
  genre?: string
}
