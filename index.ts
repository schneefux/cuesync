import DjayLibraryManager from "./lib/djay/DjayLibraryManager"
import * as path from "path"
import * as os from "os"
import SeratoLibraryManager from "./lib/serato/SeratoLibraryManager"
import Library from "./lib/Library"
import Cue from "./lib/model/Cue"

// TODO auto-detect these paths
const djayLibraryPath = path.join(os.homedir(), '\\AppData\\Local\\Packages\\59BEBC1A.djayPro_e3tqh12mt5rj6\\LocalState\\Library\\Algoriddim\\djay Preset Library.plist')
const djayLibrary = new DjayLibraryManager(djayLibraryPath)
const seratoCratePath = 'M:\\_Serato_\\Subcrates'
const seratoLibrary = new SeratoLibraryManager(seratoCratePath)

const library = new Library(seratoLibrary, djayLibrary)

async function main() {
  await library.load()
  const theConspiracy = await library.find({ title: 'Immer noch aus Liebe' })
  console.log(theConspiracy)
  theConspiracy.cues = [ { index: 0, milliseconds: 1234 } ] as Cue[]
  await library.updateSerato(theConspiracy)
  console.log(await library.find(theConspiracy))
}

main().catch(console.error)