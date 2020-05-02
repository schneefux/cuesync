<template>
  <div class="flex flex-col">
    <h2 class="text-lg font-medium text-primary-500">Cues to copy from Djay to Serato</h2>
    <div class="mt-2 flex-grow overflow-y-auto">
      <track-table :tracks="tracks"></track-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import * as path from 'path'
import * as os from 'os'
import DjayLibraryManager from '@/../../lib/djay/DjayLibraryManager'
import TrackInfo from '../../../lib/model/TrackInfo'
import TrackTable from '@/components/TrackTable.vue'

export default Vue.extend({
  props: {
    tracks: {
      type: Array as PropType<TrackInfo[]>,
      required: true,
    },
  },
  components: {
    TrackTable,
  },
})
</script>
