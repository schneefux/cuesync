<template>
  <div class="flex flex-col items-center">
    <!-- TODO select hard drives & maybe crates -->
    <template v-if="!loaded">
      <h2>Loading...</h2>
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
        <button class="button" @click="$emit('next', tracks)">confirm</button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
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
      tracks: [] as TrackInfo[],
      loaded: false,
    }
  },
  async created() {
    const drive = 'M:\\'

    this.seratoLibrary = new SeratoLibraryManager(drive)
    await this.seratoLibrary.load()
    this.tracks = this.seratoLibrary.list()
    this.loaded = true
  },
})
</script>
