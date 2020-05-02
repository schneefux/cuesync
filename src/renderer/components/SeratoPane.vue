<template>
  <div>
    <h2 class="text-lg font-medium text-primary-500">Serato Library</h2>
    <div class="mt-2 overflow-y-auto h-50vh">
      <track-table :value="tracks"></track-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as path from 'path'
import * as os from 'os'
import TrackInfo from '../../../lib/model/TrackInfo'
import TrackTable from '@/components/TrackTable.vue'
import SeratoLibraryManager from '../../../lib/serato/SeratoLibraryManager'

export default Vue.extend({
  components: {
    TrackTable,
  },
  data() {
    const seratoCratePath = 'M:\\'
    const seratoLibrary = new SeratoLibraryManager(seratoCratePath)
    return {
      seratoLibrary,
      tracks: [] as TrackInfo[],
    }
  },
  async created() {
    await this.load()
  },
  methods: {
    async load() {
      await this.seratoLibrary.load()
      this.tracks = this.seratoLibrary.list()
    },
  },
})
</script>
