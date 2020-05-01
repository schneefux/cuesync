<template>
  <div class="flex h-full">
    <div class="pane">
      <djay-pane></djay-pane>
    </div>
    <div class="pane border-primary-400 border-l-2">
      <serato-pane></serato-pane>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DjayPane from '@/components/DjayPane.vue'
import SeratoPane from '@/components/SeratoPane.vue'

export default Vue.extend({
  components: {
    DjayPane,
    SeratoPane,
  }
})
</script>

<style lang="scss" scoped>
.pane {
  @apply w-1/2 px-4 py-3;
}
</style>
