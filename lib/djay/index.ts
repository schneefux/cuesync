import { promisify } from "util";
import * as plist from "simple-plist"
import DjayLibrary from "./model/djay"
import DjayTrackInfo from "./model/DjayTrackInfo";
import * as os from "os";
import * as path from "path"

// djay stores cues
async function loadLibrary(libraryPath) {
  const library = await promisify(plist.readFile)(libraryPath) as DjayLibrary
  Object.entries(library['Song Entries']).forEach(([meta, information]) => {
    const trackInfo = new DjayTrackInfo()
    trackInfo.decode(meta, information)
    console.log(trackInfo)
  })
}

loadLibrary(path.join(os.homedir(), '\\AppData\\Local\\Packages\\59BEBC1A.djayPro_e3tqh12mt5rj6\\LocalState\\Library\\Algoriddim\\djay Preset Library.plist'))