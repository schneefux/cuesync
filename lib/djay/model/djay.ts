export interface DjaySongEntry {
  'song.cuePoints'?: number[]
  'song.manualBpm'?: number
  'song.songStart'?: number
}

export default interface DjayLibrary {
  'Song Entries'?: {
    [meta: string]: DjaySongEntry
  }
}