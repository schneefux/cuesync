<template>
  <div class="flex flex-col">
    <!-- flex-grow alone does not seem to work, so hard code header & south pane size into height -->
    <div class="flex-grow flex relative" style="height: calc(100vh - 16rem - 6rem)">
      <div class="w-1/2 h-full pane">
        <library-pane :name="sourceName" class="h-full" :library="sourceLibrary" @select="selectSourceTrack" v-model="sourceTracks"></library-pane>
      </div>
      <div class="absolute bottom-0 left-0 flex w-full justify-center -mb-5">
        <button @click="addTrack" class="bg-black rounded-full p-2">
          <i class="fas fa-arrow-circle-down fa-2x text-secondary-600"></i>
        </button>
      </div>
      <div class="w-1/2 h-full pane border-primary-400 border-l-2">
        <library-pane :name="targetName" class="h-full" :library="targetLibrary" @select="selectTargetTrack" v-model="targetTracks"></library-pane>
      </div>
    </div>

    <div class="h-32 border-primary-400 border-t-2 flex">
      <match-result-pane class="w-5/6 pane" :tracks="tracks"></match-result-pane>
      <div class="w-1/6 pane flex items-center justify-center">
        <button class="button text-xl font-semibold tracking-wide">Sync</button>
      </div>
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

export default Vue.extend({
  components: {
    LibraryPane,
    MatchResultPane,
  },
  data() {
    const seratoCratePath = 'M:\\'
    const djayLibraryPath = path.join(os.homedir(), '\\AppData\\Local\\Packages\\59BEBC1A.djayPro_e3tqh12mt5rj6\\LocalState\\Library\\Algoriddim\\djay Preset Library.plist')

    return {
      sourceName: 'Djay',
      sourceLibrary: new DjayLibraryManager(djayLibraryPath),
      sourceTrack: undefined as TrackInfo,
      sourceTracks: [] as TrackInfo[],
      targetName: 'Serato',
      targetLibrary: new SeratoLibraryManager(seratoCratePath),
      targetTrack: undefined as TrackInfo,
      targetTracks: [] as TrackInfo[],
      tracks: [] as TrackInfo[],
    }
  },
  methods: {
    addTrack() {
      if (this.sourceTrack !== undefined && this.targetTrack !== undefined) {
        this.sourceTracks = this.sourceTracks.filter(t => t != this.sourceTrack)
        this.targetTracks = this.targetTracks.filter(t => t != this.targetTrack)

        this.tracks.push({
          ...this.sourceTrack,
          ...this.targetTrack,
        })
      }
    },
    selectSourceTrack(track: TrackInfo) {
      this.sourceTrack = track
    },
    selectTargetTrack(track: TrackInfo) {
      this.targetTrack = track
    },
  },
})
</script>

<style lang="scss" scoped>
.pane {
  @apply px-4 py-3;
}
</style>
