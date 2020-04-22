const keys = [
  '8B-C', '8A-Am', '3B-Db', '3A-Bbm', '10B-D', '10A-Bm',
  '5B-Eb', '5A-Cm', '12B-E', '12A-C#m', '7B-F', '7A-Dm',
  '2B-Gb', '2A-Ebm', '9B-G', '9A-Em', '4B-Ab', '4A-Fm',
  '11B-A', '11A-F#m', '6B-Bb', '6A-Gm', '1B-B', '1A-G#m'
]

export interface DjaySongEntry {
  'song.cuePoints'?: number[]
  'song.manualBpm'?: number
  'song.manualKey'?: number
  'song.songStart'?: number
}

/**
 * 'djay Cached Data.plist': automatic values
 * 'djay Preset Library.plist': manual values
 */
export default interface DjayLibrary {
  'Song Entries'?: {
    [meta: string]: DjaySongEntry
  }
}