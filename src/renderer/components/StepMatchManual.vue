<template>
  <div class="flex flex-col items-center">
    <p>These Djay tracks could not be found in your Serato library.</p>
    <p>Click and assign tracks you wish to migrate.</p>
    <p>⚠ Durations must match or cues will be shifted.</p>
    <div class="mt-4 flex" style="height: calc(100vh - 20rem - 10rem);">
      <div class="overflow-auto" style="width: calc(50vw - 4rem);">
        <track-table
          :tracks="tracks"
          :columns="['artists', 'album', 'title', 'durationSeconds']"
          :focus="djayTrack"
          @focus="selectDjayTrack"
          key="5-1"
          focusable
          class="border-r-4 border-primary-400"
        ></track-table>
      </div>
      <div class="overflow-auto" style="width: calc(50vw - 4rem);">
        <track-table
          :tracks="seratoTracks"
          :columns="['artists', 'album', 'title', 'durationSeconds']"
          :focus="seratoTrack"
          @focus="track => seratoTrack = track"
          key="5-2"
          focusable
          class=""
        ></track-table>
      </div>
    </div>

    <div class="w-full text-center -mb-4">
      <button class="button" @click="match()">
        assign
      </button>
    </div>

    <div class="overflow-auto mt-4 flex relative" style="height: 8rem; width: calc(100vw - 8rem);">
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
import { fuzzyTrackInfoCandidate, fuzzyTrackInfoEqual } from '../../../lib/compare'

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
      candidates: [] as TrackInfo[],
      djayTrack: null as TrackInfo|null,
      seratoTrack: null as TrackInfo|null,
    }
  },
  methods: {
    selectDjayTrack(track: TrackInfo) {
      this.djayTrack = track
      // TODO sort or filter candidates?
    },
    match() {
      // TODO prevent duplicates
      this.matches.push({
        ...this.djayTrack,
        ...this.seratoTrack,
        cues: this.djayTrack.cues,
      })
    },
  },
})
</script>
