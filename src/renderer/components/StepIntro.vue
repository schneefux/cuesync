<template>
  <div class="leading-relaxed text-center">
    <h2 class="text-lg">
      <span class="text-primary-600 font-semibold">Cue Sync Pro</span>
      moves your data from Djay Pro to Serato.
    </h2>
    <p>This tool will modify your audio files.</p>
    <p class="text-sm">
      It is not affiliated with, endorsed or supported by Serato or Algoriddim.
    </p>
    <p>
      Import your music in Serato first.
    </p>
    <p class="font-bold tracking-wider">
      Create a backup before you proceed.
    </p>

    <span class="absolute text-xs text-gray-500 bottom-0 right-0 mr-2 mb-1">v{{ version }}</span>
    <button class="mt-2 button" @click="$emit('next')">understood</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import packageJson from '../../../package.json'

export default Vue.extend({
  data() {
    return {
      version: packageJson.version,
    }
  },
})
</script>
