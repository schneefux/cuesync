<template>
  <div>
    <h2 class="text-lg font-medium text-primary-500">Cues to copy from Djay to Serato</h2>
    <div class="mt-2 overflow-y-auto h-24">
      <track-table :value="tracks"></track-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as path from 'path'
import * as os from 'os'
import DjayLibraryManager from '@/../../lib/djay/DjayLibraryManager'
import TrackInfo from '../../../lib/model/TrackInfo'
import TrackTable from '@/components/TrackTable.vue'

export default Vue.extend({
  components: {
    TrackTable,
  },
  data() {
    return {
      tracks: [{
        artists: ['albzzy', 'sk'],
        title: 'the conspiracy',
        path: 'M:\\tekk\\Bis Ich Nichts Mehr Fühle-773649382.mp3',
        filename: 'Bis Ich Nichts Mehr Fühle-773649382.mp3',
        cues: [{ milliseconds: 1234 }],
      }] as TrackInfo[],
    }
  },
})
</script>
