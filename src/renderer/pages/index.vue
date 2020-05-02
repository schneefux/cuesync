<template>
  <div class="flex flex-col">
    <!-- flex-grow alone does not seem to work, so hard code header & south pane size into height -->
    <div class="flex-grow flex relative" style="height: calc(100vh - 16rem - 6rem)">
      <div class="w-1/2 h-full pane">
        <djay-pane class="h-full"></djay-pane>
      </div>
      <div class="absolute bottom-0 left-0 flex w-full justify-center -mb-5">
        <button @click="addTrack" class="bg-black rounded-full p-2">
          <i class="fas fa-arrow-circle-down fa-2x text-secondary-600"></i>
        </button>
      </div>
      <div class="w-1/2 h-full pane border-primary-400 border-l-2">
        <serato-pane class="h-full"></serato-pane>
      </div>
    </div>

    <div class="h-32 border-primary-400 border-t-2 flex">
      <match-result-pane class="w-3/4 pane"></match-result-pane>
      <div class="w-1/4 pane flex items-center justify-center">
        <button class="button text-xl font-semibold tracking-wide">Sync</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DjayPane from '@/components/DjayPane.vue'
import SeratoPane from '@/components/SeratoPane.vue'
import MatchResultPane from '@/components/MatchResultPane.vue'

export default Vue.extend({
  components: {
    DjayPane,
    SeratoPane,
    MatchResultPane,
  },
  methods: {
    addTrack() {
      console.log('merge')
    }
  },
})
</script>

<style lang="scss" scoped>
.pane {
  @apply px-4 py-3;
}
</style>
