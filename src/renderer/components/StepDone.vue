<template>
  <div class="flex flex-col items-center">
    <p class="text-lg">Done.</p>
    <p>
      <span class="text-primary-600 font-semibold">{{ tracks.length }}</span> Tracks
      have been synced from Djay Pro to Serato.
    </p>
    <p>Have fun mixing!</p>

    <div class="mt-4">
      <button class="button" @click="$emit('next')">close</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TrackInfo from '../../../lib/model/TrackInfo'

export default Vue.extend({
  props: {
    tracks: {
      type: Array as PropType<TrackInfo[]>,
      required: true,
    },
  },
})
</script>
