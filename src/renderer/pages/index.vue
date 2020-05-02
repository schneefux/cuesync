<template>
  <div>
    <div class="w-full flex relative">
      <div class="w-1/2 pane">
        <djay-pane></djay-pane>
      </div>
      <div class="absolute bottom-0 left-0 flex w-full justify-center -mb-5">
        <button @click="addTrack" class="bg-black rounded-full p-2">
          <i class="fas fa-arrow-circle-down fa-2x text-secondary-600"></i>
        </button>
      </div>
      <div class="w-1/2 pane border-primary-400 border-l-2">
        <serato-pane></serato-pane>
      </div>
    </div>

    <div class="w-full flex border-primary-400 border-t-2">
      <div class="w-3/4 pane flex">
        <match-result-pane></match-result-pane>
      </div>
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
