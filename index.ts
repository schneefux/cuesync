import DjayLibraryManager from "./lib/djay/DjayLibraryManager"
import * as path from "path"
import * as os from "os"
import SeratoLibraryManager from "./lib/serato/SeratoLibraryManager"
import DelegatingLibraryManager from "./lib/DelegatingLibraryManager"

const djayLibraryPath = path.join(os.homedir(), '\\AppData\\Local\\Packages\\59BEBC1A.djayPro_e3tqh12mt5rj6\\LocalState\\Library\\Algoriddim\\djay Preset Library.plist')
const djayLibrary = new DjayLibraryManager(djayLibraryPath)
const seratoCratePath = 'M:\\_Serato_\\Subcrates'
const seratoLibrary = new SeratoLibraryManager(seratoCratePath)

const library = new DelegatingLibraryManager(seratoLibrary, djayLibrary)

async function main() {
  await library.load()
  console.log(await library.find({ title: 'The Conspiracy' }))
}

main().catch(console.error)