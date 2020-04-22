import { promisify } from "util";
import * as plist from "simple-plist"
import DjayLibrary from "./model/djay"
import * as os from "os";
import * as path from "path"
import DjayTrackSerializer from "./DjayTrackSerializer";

// djay stores cues
async function loadLibrary(libraryPath) {
  const library = await promisify(plist.readFile)(libraryPath) as DjayLibrary
  const serializer = new DjayTrackSerializer()
  Object.entries(library['Song Entries']).forEach(([key, value]) => {
    const trackInfo = serializer.deserialize({ key, value })
    console.log(trackInfo)
  })
}

loadLibrary(path.join(os.homedir(), '\\AppData\\Local\\Packages\\59BEBC1A.djayPro_e3tqh12mt5rj6\\LocalState\\Library\\Algoriddim\\djay Preset Library.plist'))