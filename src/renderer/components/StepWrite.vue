<template>
  <div class="leading-relaxed text-center">
    <template v-if="!loading">
      <h2 class="text-lg">All set and ready to go.</h2>
      <p>{{ tracks.length }} files will be updated.</p>
      <button class="mt-2 button uppercase" @click="write()">sync!</button>
    </template>
    <template v-else>
      <p v-if="loading">Processing...</p>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TrackInfo from '../../../lib/model/TrackInfo'
import SeratoLibraryManager from '../../../lib/serato/SeratoLibraryManager'

export default Vue.extend({
  props: {
    tracks: {
      type: Array as PropType<TrackInfo[]>,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async write() {
      this.seratoLibrary = new SeratoLibraryManager('')
      for (const track of this.tracks) {
        await this.seratoLibrary.update(track)
      }

      this.$emit('next')
    },
  },
})
</script>
