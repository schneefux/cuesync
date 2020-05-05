<template>
  <div class="flex flex-col items-center">
    <template v-if="libraryExists == false">
      <h2 class="text-lg font-semibold">Ow :(</h2>
      <p>No Djay Library could be found on your computer.</p>
      <p>If you think that this is an error, please send me a mail.</p>
    </template>
    <template v-else>
      <template v-if="!loaded">
        <h2>Loading...</h2>
      </template>
      <template v-else>
        <h2 class="h-10 text-xl">Cue Sync Pro has found these tracks in your DJay Library:</h2>
        <div class="overflow-auto mt-4" style="height: calc(100vh - 20rem); width: calc(100vw - 8rem);">
          <track-table
            :tracks="tracks"
            :columns="['artists', 'title', 'cues', 'bpm', 'songStart']"
          ></track-table>
        </div>

        <div class="mt-2">
          <button class="button" @click="$emit('next', tracks)">confirm</button>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'
import DjayLibraryManager from '../../../lib/djay/DjayLibraryManager'
import TrackInfo from '../../../lib/model/TrackInfo'
import TrackTable from '@/components/TrackTable.vue'

export default Vue.extend({
  components: {
    TrackTable,
  },
  async created() {
    const djayLibraryPath = os.platform() == 'darwin' ?
      path.join(os.homedir(), '/Library/Containers/com.algoriddim.djay-pro-mac/Data/Library/Application Support/Algoriddim/djay Preset Library.plist')
      : path.join(os.homedir(), '\\AppData\\Local\\Packages\\59BEBC1A.djayPro_e3tqh12mt5rj6\\LocalState\\Library\\Algoriddim\\djay Preset Library.plist')

    try {
      await fs.promises.access(djayLibraryPath)
    } catch (err) {
      this.libraryExists = false
      return
    }

    this.djayLibrary = new DjayLibraryManager(djayLibraryPath)
    await this.djayLibrary.load()
    this.tracks = this.djayLibrary.list()
    this.loaded = true
  },
  data() {
    return {
      loaded: false,
      libraryExists: true,
      djayLibrary: null as DjayLibraryManager|null,
      tracks: [] as TrackInfo[],
    }
  },
})
</script>
