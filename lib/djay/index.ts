import { promisify } from "util";
import * as plist from "simple-plist"
import DjayLibrary from "./model/djay"
import DjayTrackInfo from "./model/DjayTrackInfo";

// djay stores cues
async function loadLibrary(libraryPath) {
  const library = await promisify(plist.readFile)(libraryPath) as DjayLibrary
  Object.entries(library['Song Entries']).forEach(([meta, information]) => {
    const trackInfo = new DjayTrackInfo()
    trackInfo.decode(meta, information)
    console.log(trackInfo)
  })
}

loadLibrary('djay Preset Library.plist')