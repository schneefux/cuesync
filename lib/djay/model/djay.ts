export const djayKeys = [
  'C', 'Am', 'Db', 'Bbm', 'D', 'Bm',
  'Eb', 'Cm', 'E', 'C#m', 'F', 'Dm',
  'Gb', 'Ebm', 'G', 'Em', 'Ab', 'Fm',
  'A', 'F#m', 'Bb', 'Gm', 'B', 'G#m'
]

export interface DjaySongEntry {
  'song.cuePoints'?: number[]
  'song.manualBpm'?: number
  'song.manualKey'?: number
  'song.songStart'?: number
  'song.manualGridStartPoint'?: number
}

/**
 * 'djay Cached Data.plist': automatic values
 * 'djay Preset Library.plist': manual values
 */
export default interface DjayLibrary {
  'Song Entries'?: {
    [key: string]: DjaySongEntry
  }
}