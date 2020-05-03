<template>
  <div class="flex flex-col">
    <!-- flex-grow alone does not seem to work, so hard code header & south pane size into height -->
    <div class="flex-grow flex relative" style="height: calc(100vh - 16rem - 6rem)">
      <div class="w-1/2 h-full pane">
        <library-pane
          v-model="sourceTracks"
          :name="sourceName"
          :library="sourceLibrary"
          :selection="sourceTrack"
          class="h-full"
          @select="selectSourceTrack"
        ></library-pane>
      </div>
      <div class="absolute bottom-0 left-0 flex flex-col w-full justify-center items-center -mb-8">
        <button @click="magicMatchClicked" class="bg-black rounded-full p-2 m-1">
          <i class="fas fa-magic fa-2x text-secondary-500"></i>
        </button>
        <button @click="addTrackClicked" class="bg-black rounded-full p-2 m-1">
          <i class="fas fa-arrow-circle-down fa-2x text-secondary-500"></i>
        </button>
      </div>
      <div class="w-1/2 h-full pane border-primary-400 border-l-2">
        <library-pane
          v-model="targetTracks"
          :name="targetName"
          :library="targetLibrary"
          :selection="targetTrack"
          class="h-full"
          @select="selectTargetTrack"
        ></library-pane>
      </div>
    </div>

    <div class="h-48 pane border-primary-400 border-t-2">
      <match-result-pane
        v-model="tracks"
        :source-name="sourceName"
        :target-name="targetName"
        class="h-full"
        @sync="syncTracksClicked"
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
import { fuzzyTrackInfoEqual } from '../../../lib/compare'

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
      sourceTrack: null as TrackInfo|null,
      sourceTracks: [] as TrackInfo[],
      targetName: 'Serato',
      targetLibrary: new SeratoLibraryManager(seratoCratePath),
      targetTrack: null as TrackInfo|null,
      targetTracks: [] as TrackInfo[],
      tracks: [] as TrackInfo[],
    }
  },
  methods: {
    addTrackClicked() {
      if (this.sourceTrack !== null && this.targetTrack !== null) {
        this.addTrack(this.sourceTrack, this.targetTrack)
        this.sourceTrack = null
        this.targetTrack = null
      }
    },
    addTrack(sourceTrack: TrackInfo, targetTrack: TrackInfo) {
      this.sourceTracks = this.sourceTracks.filter(t => t != sourceTrack)
      this.targetTracks = this.targetTracks.filter(t => t != targetTrack)

      // add non-existant attributes & overwrite cues
      this.tracks.push({
        ...sourceTrack,
        ...targetTrack,
        cues: sourceTrack.cues,
      })
    },
    magicMatchClicked() {
      this.sourceTracks.forEach(source => {
        this.targetTracks.forEach(target => {
          if (fuzzyTrackInfoEqual(source, target)) {
            this.addTrack(source, target)
          }
        })
      })
    },
    selectSourceTrack(track: TrackInfo) {
      this.sourceTrack = track

      this.targetTrack = this.targetTracks.find(target => fuzzyTrackInfoEqual(track, target)) || null
    },
    selectTargetTrack(track: TrackInfo) {
      this.targetTrack = track
    },
    async syncTracksClicked() {
      for (const track of this.tracks) {
        await this.targetLibrary.update(track)
        this.tracks = this.tracks.filter(t => t !== track)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.pane {
  @apply px-4 py-3;
}
</style>
