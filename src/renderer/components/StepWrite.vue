<template>
  <div class="flex flex-col items-center">
    <template v-if="!loading">
      <div class="text-center leading-relaxed">
        <h2 class="text-lg">All set and ready to go.</h2>
        <p>{{ tracks.length }} files will be updated.</p>
      </div>
      <div class="overflow-auto mt-4" style="height: calc(100vh - 18rem); width: calc(100vw - 8rem);">
        <track-table
          :tracks="tracks"
          :columns="['artists', 'album', 'title']"
        ></track-table>
      </div>
      <button class="mt-2 button uppercase" @click="write()">sync!</button>
    </template>
    <template v-else>
      <p v-if="loading">Processing... {{ Math.floor(this.progress * 100) }}%</p>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TrackInfo from '../../../lib/model/TrackInfo'
import SeratoLibraryManager from '../../../lib/serato/SeratoLibraryManager'
import TrackTable from '@/components/TrackTable.vue'

export default Vue.extend({
  components: {
    TrackTable,
  },
  props: {
    tracks: {
      type: Array as PropType<TrackInfo[]>,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      progress: 0,
    }
  },
  methods: {
    async write() {
      this.loading = true

      const seratoLibrary = new SeratoLibraryManager('')
      for (const track of this.tracks) {
        await seratoLibrary.update(track)
        this.progress += 1.0/this.tracks.length
      }

      this.$emit('next')
    },
  },
})
</script>
