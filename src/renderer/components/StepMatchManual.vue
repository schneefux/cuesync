<template>
  <div class="flex flex-col items-center">
    <p>These tracks could not be found in your Serato library.</p>
    <p>If there are any tracks you wish to migrate, assign them manually.</p>
    <div class="overflow-auto mt-4 flex" style="height: calc(100vh - 20rem - 5rem); width: calc(100vw - 8rem);">
      <track-table
        :tracks="tracks"
        :columns="['artists', 'album', 'title']"
        :focus="djayTrack"
        @focus="track => djayTrack = track"
        key="5-1"
        focusable
      ></track-table>
      <track-table
        :tracks="seratoTracks"
        :columns="['artists', 'album', 'title']"
        :focus="seratoTrack"
        @focus="track => seratoTrack = track"
        key="5-2"
        focusable
        class="border-l-4 border-primary-400 w-1/2"
      ></track-table>
    </div>

    <div class="w-full text-center -mb-4">
      <button class="button" @click="match()">
        assign
      </button>
    </div>

    <div class="overflow-auto mt-4 flex relative" style="height: 5rem; width: calc(100vw - 8rem);">
      <!-- TODO add delete -->
      <track-table
        :tracks="matches"
        :columns="['artists', 'album', 'title']"
        key="5-1"
      ></track-table>
    </div>

    <div class="mt-2">
      <button class="button" @click="$emit('next', matches)">next</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TrackInfo from '../../../lib/model/TrackInfo'
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
    seratoTracks: {
      type: Array as PropType<TrackInfo[]>,
      required: true,
    },
  },
  data() {
    return {
      matches: [] as TrackInfo[],
      djayTrack: null as TrackInfo|null,
      seratoTrack: null as TrackInfo|null,
    }
  },
  methods: {
    match() {
      this.matches.push({
        ...this.djayTrack,
        ...this.seratoTrack,
        cues: this.djayTrack.cues,
      })
    },
  },
})
</script>
