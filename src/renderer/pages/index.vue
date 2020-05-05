<template>
  <div class="h-screen flex flex-col items-center px-16 py-6">
    <div class="max-w-md h-20 bg-background-600 stepper">
      <div
        v-for="s in 7"
        :key="s"
        class="stepper__step"
        :class="{ 'stepper__step--complete': s - 1 < step, 'stepper__step--active': s - 1 == step }"
      ></div>
      <h1 class="stepper__title">
        <template v-if="step == 0">1. Introduction</template>
        <template v-if="step == 1">2. Load Djay Data</template>
        <template v-if="step == 2">3. Load Serato Data</template>
        <template v-if="step == 3">4. Sure Matches</template>
        <template v-if="step == 4">5. Overwriting Matches</template>
        <template v-if="step == 5">6. Manual Matches</template>
        <template v-if="step == 6">7. Processing</template>
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

          <button class="mt-2 button" @click="step++; loadDjay()">understood</button>
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
            <template v-else>
              <h2 class="h-10 text-xl">Cue Sync Pro has found these tracks in your DJay Library:</h2>
              <div class="overflow-auto mt-4" style="height: calc(100vh - 20rem); width: calc(100vw - 8rem);">
                <track-table
                  :tracks="djayTracks"
                  :columns="djayLibrary.attributes()"
                  :default-columns="['artists', 'title', 'cues', 'bpm', 'songStart']"
                  key="1"
                ></track-table>
              </div>

              <div class="mt-2">
                <button class="button" @click="seratoLoadStep()">confirm</button>
              </div>
            </template>
          </template>
        </div>

        <div v-if="step == 2" class="flex flex-col items-center">
          <!-- TODO select hard drives & maybe crates -->
          <template v-if="!seratoLoaded">
            <h2>Loading...</h2>
          </template>
          <template v-else>
            <h2 class="h-10 text-xl">Cue Sync Pro has found these tracks in your Serato Library:</h2>
            <div class="overflow-auto mt-4" style="height: calc(100vh - 20rem); width: calc(100vw - 8rem);">
              <track-table
                :tracks="seratoTracks"
                :columns="seratoLibrary.attributes()"
                :default-columns="['artists', 'album', 'title', 'cues', 'bpm']"
                key="2"
              ></track-table>
            </div>

            <div class="mt-2">
              <button class="button" @click="step++; match()">confirm</button>
            </div>
          </template>
        </div>

        <div v-if="step == 3" class="flex flex-col items-center">
          <p>Based on their meta data, these tracks belong to both libraries, but have no cues set in Serato.</p>
          <p>Uncheck tracks you do not want to migrate.</p>
          <div class="overflow-auto mt-4" style="height: calc(100vh - 20rem); width: calc(100vw - 8rem);">
            <track-table
              :tracks="sureMatches"
              :columns="seratoLibrary.attributes()"
              :default-columns="['artists', 'album', 'title']"
              @selections="tracks => tracksToWrite = tracksToWrite.concat(tracks)"
              key="3"
              checkable
            ></track-table>
          </div>

          <div class="mt-2">
            <button class="button" @click="step++">next</button>
          </div>
        </div>

        <div v-if="step == 4" class="flex flex-col items-center">
          <p>These tracks belong to both libraries, but their Serato cues will be overwritten.</p>
          <p>Uncheck tracks you do not want to migrate.</p>
          <div class="overflow-auto mt-4" style="height: calc(100vh - 20rem); width: calc(100vw - 8rem);">
            <track-table
              :tracks="overwritingSureMatches"
              :columns="seratoLibrary.attributes()"
              :default-columns="['artists', 'album', 'title']"
              @selections="tracks => tracksToWrite = tracksToWrite.concat(tracks)"
              key="4"
              checkable
            ></track-table>
          </div>

          <div class="mt-2">
            <button class="button" @click="step++">next</button>
          </div>
        </div>

        <div v-if="step == 5" class="flex flex-col items-center">
          <p>These tracks could not be found in your Serato library.</p>
          <p>If there are any tracks you wish to migrate, assign them manually.</p>
          <div class="overflow-auto mt-4 flex" style="height: calc(100vh - 20rem); width: calc(100vw - 8rem);">
            <track-table
              :tracks="unsureMatches"
              :columns="seratoLibrary.attributes()"
              :default-columns="['artists', 'album', 'title']"
              @selections="tracks => tracksToWrite = tracksToWrite.concat(tracks)"
              :focus="djayTrack"
              @focus="track => djayTrack = track"
              key="5-1"
              focusable
              class="w-1/2"
            ></track-table>
            <track-table
              :tracks="seratoTracks"
              :columns="seratoLibrary.attributes()"
              :default-columns="['artists', 'album', 'title']"
              @selections="tracks => tracksToWrite = tracksToWrite.concat(tracks)"
              :focus="seratoTrack"
              @focus="track => seratoTrack = track"
              key="5-2"
              focusable
              class="border-l-4 border-primary-400 w-1/2"
            ></track-table>
          </div>

          <div>
            <button class="button" @click="tracksToWrite.push(djayTrack)">
              assign
            </button>
          </div>

          <div class="mt-2">
            <button class="button" @click="step++; write()">next</button>
          </div>
        </div>

        <div v-if="step == 6" class="flex flex-col items-center">
          Processing...
        </div>

        <div v-if="step == 7" class="flex flex-col items-center">
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
import { fuzzyTrackInfoEqual, fuzzyTrackInfoCandidate } from '../../../lib/compare'

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
      sureMatches: [] as TrackInfo[],
      overwritingSureMatches: [] as TrackInfo[],
      unsureMatches: [] as TrackInfo[],
      tracksToWrite: [] as TrackInfo[],
      djayTrack: null as TrackInfo|null,
      seratoTrack: null as TrackInfo|null,
    }
  },
  computed: {
  },
  methods: {
    async loadDjay() {
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
    match() {
      this.djayTracks.forEach(source => {
        let anyMatch = false
        this.seratoTracks.forEach(target => {
          if (fuzzyTrackInfoEqual(source, target)) {
            const t = {
              ...source,
              ...target,
              cues: source.cues,
            }

            if (fuzzyTrackInfoCandidate(source, target)) {
              anyMatch = true
              if (target.cues.length == 0) {
                this.sureMatches.push(t)
              } else {
                this.overwritingSureMatches.push(t)
              }
            }
          }
        })
        if (!anyMatch) {
          this.unsureMatches.push(source)
        }
      })
    },
    async write() {
      this.step++

      for (const track of this.matchedTracks) {
        await this.seratoLibrary.update(track)
      }

      this.step++
    },
  },
})
</script>

<style lang="scss" scoped>
.stepper {
  @apply flex flex-wrap justify-center;

  &__step {
    @apply h-6 w-6 my-3 mx-3 rounded-full bg-background-400;

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
