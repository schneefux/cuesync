<template>
  <div class="flex flex-col items-center">
    <p class="text-xl">Done.</p>
    <p class="text-lg">
      <span class="text-primary-600 font-semibold">{{ tracks.length }}</span> Tracks
      have been synced from Djay Pro to Serato.
    </p>

    <div>
      <button class="float-left mr-4 text-blue-300 hover:text-blue-200 leading-snug" @click="openPaypal()">
        <span class="text-6xl pulse">💖</span>
        <p class="underline">
          <span class="text-xl">Support Me</span><br>
          via PayPal
        </p>
      </button>
      <p class="mt-6 leading-relaxed">
        Developing this software took months. <br>
        Instead of selling it for 10€, I am giving it to you for free. <br>
        You can buy me a coffee if you want :)
      </p>
    </div>

    <div class="mt-6">
      <button class="button" @click="$emit('next')">close</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { shell } from 'electron'
import TrackInfo from '../../../lib/model/TrackInfo'

export default Vue.extend({
  props: {
    tracks: {
      type: Array as PropType<TrackInfo[]>,
      required: true,
    },
  },
  methods: {
    openPaypal() {
      shell.openExternal('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Y9TKS7F2E2A2E')
    },
  },
})
</script>

<style lang="scss" scoped>
.pulse {
  @apply block;
  animation-name: pulse;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 3s;
}

.pulse:hover {
  animation-duration: 1s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  20% { transform: scale(1.1); }
  40% { transform: scale(1); }
  60% { transform: scale(1.1); }
  80% { transform: scale(1); }
  100% { transform: scale(1); }
}
</style>
