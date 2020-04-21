import { readSeratoCues } from "./lib/serato"

const seratojs = require('seratojs')

readSeratoCues('./source.mp3').then(console.log)
// TODO load crates, match files and write into meta data
