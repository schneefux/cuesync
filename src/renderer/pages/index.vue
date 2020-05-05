<template>
  <div class="h-screen flex flex-col items-center px-16 py-6">
    <div class="max-w-md h-20 bg-background-600 stepper">
      <div
        v-for="s in 5"
        :key="s"
        class="stepper__step"
        :class="{ 'stepper__step--complete': s - 1 < step, 'stepper__step--active': s - 1 == step }"
      ></div>
      <h1 class="stepper__title">
        <template v-if="step == 0">1. Introduction</template>
        <template v-if="step == 1">2. Load Djay Data</template>
        <template v-if="step == 2">3. Load Serato Data</template>
        <template v-if="step == 3">4. Match</template>
        <template v-if="step == 4">5. Processing</template>
      </h1>
    </div>

    <div class="flex-grow flex flex-col justify-center pt-6">
      <div class="bg-background-600 px-6 py-4 my-auto">
        <div v-if="step == 0" class="leading-relaxed text-center">
          <h2 class="text-lg">
            <span class="text-primary-600 font-semibold">Cue Sync Pro</span>
            moves your data from Djay Pro to Serato.
          </h2>
          <p>This tool will modify your audio files.</p>
          <p class="text-sm">
            It is not affiliated with, endorsed or supported by Serato or Algoriddim.
          </p>
          <p class="font-bold tracking-wider">
            Create a backup before you proceed.
          </p>

          <button class="mt-2 button" @click="djayLoadStep()">understood</button>
        </div>

        <div v-if="step == 1" class="flex flex-col items-center">
          <template v-if="djayLibraryExists == false">
            <h2 class="text-lg font-semibold">Ow :(</h2>
            <p>No Djay Library could be found on your computer.</p>
            <p>If you think that this is an error, please send me a mail.</p>
          </template>
          <template v-else>
            <template v-if="!djayLoaded">
              <h2>Loading...</h2>
            </template>
            <template v-if="djayLoaded">
              <h2 class="h-10 text-xl">Data in your DJay Library:</h2>
              <div class="overflow-auto mt-4" style="height: calc(100vh - 20rem); width: calc(100vw - 8rem);">
                <track-table
                  v-model="djayTracks"
                  :columns="djayLibrary.attributes()"
                  :default-columns="['artists', 'title', 'cues', 'bpm', 'songStart']"
                ></track-table>
              </div>

              <div class="mt-2">
                <button class="button" @click="seratoLoadStep()">confirm</button>
              </div>
            </template>
          </template>
        </div>

        <div v-if="step == 2" class="flex flex-col items-center">
          <template v-if="!seratoLoaded">
            <h2>Loading...</h2>
          </template>
          <template v-if="seratoLoaded">
            <h2 class="h-10 text-xl">Data in your Serato Library:</h2>
            <div class="overflow-auto mt-4" style="height: calc(100vh - 20rem); width: calc(100vw - 8rem);">
              <track-table
                v-model="seratoTracks"
                :columns="seratoLibrary.attributes()"
                :default-columns="['artists', 'album', 'title', 'cues', 'bpm']"
              ></track-table>
            </div>

            <div class="mt-2">
              <button class="button" @click="matchStep()">confirm</button>
            </div>
          </template>
        </div>

        <div v-if="step == 3" class="flex flex-col items-center">
          <h2 class="h-10 text-xl">Match Tracks</h2>
          <div class="overflow-auto mt-4" style="height: calc(100vh - 20rem); width: calc(100vw - 8rem);">
            <track-table
              v-model="matchedTracks"
              :columns="seratoLibrary.attributes()"
              :default-columns="['artists', 'album', 'title', 'cues', 'bpm']"
              deletable
            ></track-table>
          </div>

          <div class="mt-2">
            <button class="button" @click="writeStep()">write</button>
          </div>
        </div>

        <div v-if="step == 4" class="flex flex-col items-center">
          Processing...
        </div>

        <div v-if="step == 5" class="flex flex-col items-center">
          <p>
            Done. <span class="text-primary-600 font-semibold">{{ matchedTracks.length }}</span> Tracks
            have been synced from Djay Pro to Serato.
          </p>
          <p>Have fun mixing!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'
import TrackInfo from '../../../lib/model/TrackInfo'
import TrackTable from '@/components/TrackTable.vue'
import DjayLibraryManager from '../../../lib/djay/DjayLibraryManager'
import SeratoLibraryManager from '../../../lib/serato/SeratoLibraryManager'
import { fuzzyTrackInfoEqual } from '../../../lib/compare'

export default Vue.extend({
  layout: 'empty',
  components: {
    TrackTable,
  },
  data() {
    return {
      step: 0,
      djayLibraryExists: true,
      djayLibrary: null as DjayLibraryManager|null,
      djayTracks: [] as TrackInfo[],
      djayLoaded: false,
      seratoLibrary: null as SeratoLibraryManager|null,
      seratoTracks: [] as TrackInfo[],
      seratoLoaded: false,
      matchedTracks: [] as TrackInfo[],
    }
  },
  computed: {
  },
  methods: {
    async djayLoadStep() {
      this.step++

      const djayLibraryPath = os.platform() == 'darwin' ?
        path.join(os.homedir(), '/Library/Containers/com.algoriddim.djay-pro-mac/Data/Library/Application Support/Algoriddim/djay Preset Library.plist')
        : path.join(os.homedir(), '\\AppData\\Local\\Packages\\59BEBC1A.djayPro_e3tqh12mt5rj6\\LocalState\\Library\\Algoriddim\\djay Preset Library.plist')

      try {
        await fs.promises.access(djayLibraryPath)
      } catch (err) {
        this.djayLibraryExists = false
        return
      }

      this.djayLibrary = new DjayLibraryManager(djayLibraryPath)
      await this.djayLibrary.load()
      this.djayTracks = this.djayLibrary.list()
      this.djayLoaded = true
    },
    async seratoLoadStep() {
      this.step++

      // TODO add select / detect other drives
      const drive = 'M:\\'

      this.seratoLibrary = new SeratoLibraryManager(drive)
      await this.seratoLibrary.load()
      this.seratoTracks = this.seratoLibrary.list()
      this.seratoLoaded = true
    },
    async matchStep() {
      this.step++

      this.djayTracks.forEach(source => {
        this.seratoTracks.forEach(target => {
          if (fuzzyTrackInfoEqual(source, target)) {
            this.matchedTracks.push({
              ...source,
              ...target,
              cues: source.cues,
            })
          }
        })
      })
    },
    async writeStep() {
      this.step++

      for (const track of this.matchedTracks) {
        await this.seratoLibrary.update(track)
      }

      this.doneStep()
    },
    async doneStep() {
      this.step++
    },
  },
})
</script>

<style lang="scss" scoped>
.stepper {
  @apply flex flex-wrap justify-center;

  &__step {
    @apply h-6 w-6 my-3 mx-4 rounded-full bg-background-400;

    &--active {
      @apply bg-primary-400;
    }

    &--complete {
      @apply bg-primary-700;
    }
  }

  &__title {
    @apply w-full text-center tracking-wide text-lg mb-2;
  }
}
</style>
