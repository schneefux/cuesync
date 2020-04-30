<template>
  <div class="flex h-full">
    <div class="pane">
      <source-pane></source-pane>
    </div>
    <div class="pane border-primary-400 border-l-2">
      right pane
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SourcePane from '@/components/SourcePane.vue'

export default Vue.extend({
  components: {
    SourcePane,
  }
})
</script>

<style lang="scss" scoped>
.pane {
  @apply w-1/2 px-4 py-3;
}
</style>
