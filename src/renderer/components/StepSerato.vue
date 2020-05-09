<template>
  <div class="flex flex-col items-center">
    <template v-if="libraryExists == false">
      <h2 class="text-lg font-semibold">Ow :(</h2>
      <p>No Serato Library could be found on your computer.</p>
      <p>If you think that this is an error, please send me a mail.</p>
    </template>
    <template v-else>
      <!-- TODO select hard drives & maybe crates -->
      <template v-if="!loaded">
        <h2>Loading Serato library...</h2>
      </template>
      <template v-else>
        <h2 class="h-6 text-lg">Cue Sync Pro has found these tracks in your Serato Library:</h2>
        <div class="overflow-auto mt-4" style="height: calc(100vh - 18rem); width: calc(100vw - 8rem);">
          <track-table
            :tracks="tracks"
            :columns="['artists', 'album', 'title', 'cues', 'bpm']"
          ></track-table>
        </div>

        <div class="mt-4">
          <button class="button" @click="$emit('next', tracks)">okay</button>
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
import SeratoLibraryManager from '../../../lib/serato/SeratoLibraryManager'
import TrackInfo from '../../../lib/model/TrackInfo'
import TrackTable from '@/components/TrackTable.vue'

export default Vue.extend({
  components: {
    TrackTable,
  },
  data() {
    return {
      seratoLibrary: null as SeratoLibraryManager|null,
      libraryExists: true,
      tracks: [] as TrackInfo[],
      loaded: false,
    }
  },
  async created() {
    const libraryPath = path.join(os.homedir(), 'Music')
    const subcratesPath = path.join(libraryPath, '_Serato_', 'Subcrates')

    try {
      await fs.promises.access(subcratesPath)
    } catch (err) {
      this.libraryExists = false
      return
    }


    this.seratoLibrary = new SeratoLibraryManager(libraryPath)
    await this.seratoLibrary.load()
    this.tracks = this.seratoLibrary.list()
    this.loaded = true
  },
})
</script>
