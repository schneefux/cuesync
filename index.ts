import { readTrack } from "./lib/serato"

const seratojs = require('seratojs')

readTrack('./files/test.flac').then(console.log)
readTrack('./test.mp3').then(console.log)
// TODO load crates, match files and write into meta data
