<template>
  <div>
    <h2 class="text-lg font-medium text-primary-500">Djay Library</h2>
    <div class="mt-2 overflow-y-auto h-50vh">
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
    const djayLibraryPath = path.join(os.homedir(), '\\AppData\\Local\\Packages\\59BEBC1A.djayPro_e3tqh12mt5rj6\\LocalState\\Library\\Algoriddim\\djay Preset Library.plist')
    const djayLibrary = new DjayLibraryManager(djayLibraryPath)
    return {
      djayLibrary,
      search: '',
      trackInfo: {} as TrackInfo|null,
      tracks: [] as TrackInfo[],
    }
  },
  async created() {
    await this.load()
  },
  methods: {
    async load() {
      await this.djayLibrary.load()
      this.tracks = this.djayLibrary.list()
    },
  },
})
</script>
