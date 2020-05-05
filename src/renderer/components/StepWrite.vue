<template>
  <div class="leading-relaxed text-center">
    <p v-if="!loading">{{ tracks.length }} files will be updated.</p>

    <button v-if="!loading" class="mt-2 button uppercase" @click="write()">sync!</button>

    <p v-if="loading">Processing...</p>
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
