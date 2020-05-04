<template>
  <div class="flex flex-col">
    <!-- flex-grow alone does not seem to work, so hard code header & south pane size into height -->
    <div class="flex-grow flex relative" style="height: calc(100vh - 16rem - 6rem)">
      <div class="w-1/2 h-full pane">
        <library-pane
          v-model="sourceTracks"
          :name="sourceName"
          :library="sourceLibrary"
          :selection="selectedSourceTrack"
          class="h-full"
          @select="selectSourceTrack"
        ></library-pane>
      </div>
      <div class="absolute bottom-0 left-0 right-0 flex flex-col w-full justify-center items-center -mb-8 pointer-events-none">
        <button @click="magicMatchClicked" class="bg-black rounded-full p-2 m-1 pointer-events-auto">
          <i class="fas fa-magic fa-2x text-secondary-500"></i>
        </button>
        <button @click="addTrackClicked" class="bg-black rounded-full p-2 m-1 pointer-events-auto">
          <i class="fas fa-arrow-circle-down fa-2x text-secondary-500"></i>
        </button>
      </div>
      <div class="w-1/2 h-full pane border-primary-400 border-l-2">
        <library-pane
          v-model="filteredTargetTracks"
          :name="targetName"
          :library="targetLibrary"
          :selection="selectedTargetTrack"
          class="h-full"
          @select="selectTargetTrack"
        ></library-pane>
      </div>
    </div>

    <div class="h-48 pane border-primary-400 border-t-2">
      <match-result-pane
        v-model="matchedTracks"
        :source-name="sourceName"
        :target-name="targetName"
        :target-library="targetLibrary"
        class="h-full"
      ></match-result-pane>
    </div>
  </div>
</template>

<script lang="ts">
import * as path from 'path'
import * as os from 'os'
import Vue from 'vue'
import LibraryPane from '@/components/LibraryPane.vue'
import MatchResultPane from '@/components/MatchResultPane.vue'
import TrackInfo from '../../../lib/model/TrackInfo'
import DjayLibraryManager from '../../../lib/djay/DjayLibraryManager'
import SeratoLibraryManager from '../../../lib/serato/SeratoLibraryManager'
import { fuzzyTrackInfoEqual, fuzzyTrackInfoCandidate } from '../../../lib/compare'

export default Vue.extend({
  components: {
    LibraryPane,
    MatchResultPane,
  },
  async created() {
    await this.sourceLibrary.load()
    await this.targetLibrary.load()
  },
  data() {
    const seratoCratePath = 'M:\\'
    const djayLibraryPath = path.join(os.homedir(), '\\AppData\\Local\\Packages\\59BEBC1A.djayPro_e3tqh12mt5rj6\\LocalState\\Library\\Algoriddim\\djay Preset Library.plist')

    return {
      sourceName: 'Djay',
      sourceLibrary: new DjayLibraryManager(djayLibraryPath),
      selectedSourceTrack: null as TrackInfo|null,
      targetName: 'Serato',
      targetLibrary: new SeratoLibraryManager(seratoCratePath),
      selectedTargetTrack: null as TrackInfo|null,
      matchedTracks: [] as TrackInfo[],
    }
  },
  computed: {
    sourceTracks() {
      return this.sourceLibrary.list()
    },
    filteredTargetTracks() {
      if (this.selectedSourceTrack == null) {
        return []
      }

      return this.targetLibrary.list()
        .filter(t => fuzzyTrackInfoCandidate(t, this.selectedSourceTrack))
    },
  },
  methods: {
    addTrackClicked() {
      if (this.selectedSourceTrack !== null && this.selectedTargetTrack !== null) {
        this.addTrack(this.selectedSourceTrack, this.selectedTargetTrack)
        this.selectedSourceTrack = null
        this.selectedTargetTrack = null
      }
    },
    addTrack(selectedSourceTrack: TrackInfo, selectedTargetTrack: TrackInfo) {
      // add non-existant attributes & overwrite cues
      this.matchedTracks.push({
        ...selectedSourceTrack,
        ...selectedTargetTrack,
        cues: selectedSourceTrack.cues,
      })
    },
    magicMatchClicked() {
      this.sourceLibrary.list().forEach(source => {
        this.targetLibrary.list().forEach(target => {
          if (fuzzyTrackInfoEqual(source, target)) {
            this.addTrack(source, target)
          }
        })
      })
    },
    selectSourceTrack(track: TrackInfo) {
      this.selectedSourceTrack = track
    },
    selectTargetTrack(track: TrackInfo) {
      this.selectedTargetTrack = track
    },
  },
  watch: {
    filteredTargetTracks() {
      this.selectedTargetTrack = this.filteredTargetTracks
        .find(target => fuzzyTrackInfoEqual(this.selectedSourceTrack, target)) || null
    },
  },
})
</script>

<style lang="scss" scoped>
.pane {
  @apply px-4 py-3;
}
</style>
