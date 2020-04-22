import Cue from "./Cue";

export default interface TrackInfo {
  title?: string
  artists?: string[]
  cues?: Cue[]
  bpm?: number
  durationSeconds?: number
  songStart?: number
  path?: string
  filename?: string
}