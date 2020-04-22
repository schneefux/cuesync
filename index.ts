import DjayLibraryManager from "./lib/djay/DjayLibraryManager"
import * as path from "path"
import * as os from "os"
import SeratoLibraryManager from "./lib/serato/SeratoLibraryManager"

const djayLibraryPath = path.join(os.homedir(), '\\AppData\\Local\\Packages\\59BEBC1A.djayPro_e3tqh12mt5rj6\\LocalState\\Library\\Algoriddim\\djay Preset Library.plist')
const djayLibrary = new DjayLibraryManager(djayLibraryPath)
const seratoCratePath = 'M:\\_Serato_\\Subcrates'
const seratoLibrary = new SeratoLibraryManager(seratoCratePath)

async function main() {
  await djayLibrary.load()
  console.log(await djayLibrary.find({ title: 'the conspiracy' }))

  await seratoLibrary.load()
  console.log(await seratoLibrary.find({ title: 'The Conspiracy' }))
}

main().catch(console.error)