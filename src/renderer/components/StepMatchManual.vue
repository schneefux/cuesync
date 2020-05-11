<template>
  <div class="flex flex-col items-center">
    <p>These Djay tracks could not be found in your Serato library.</p>
    <p>Click and assign tracks you wish to migrate.</p>
    <p>⚠ Durations must match or cues will be shifted.</p>
    <div class="mt-4 flex relative" style="height: calc(100vh - 20rem - 10rem);">
      <div class="overflow-auto mr-2" style="width: calc(50vw - 4.5rem);">
        <track-table
          :tracks="filteredDjayTracks"
          :columns="['artists', 'album', 'title', 'durationSeconds']"
          :focus="djayTrack"
          @focus="selectDjayTrack"
          key="5-1"
          focusable
          searchable
        ></track-table>
      </div>
      <div class="overflow-auto ml-2" style="width: calc(50vw - 4.5rem);">
        <track-table
          :tracks="filteredSeratoTracks"
          :columns="['artists', 'album', 'title', 'durationSeconds']"
          :focus="seratoTrack"
          @focus="track => seratoTrack = track"
          key="5-2"
          focusable
          searchable
        ></track-table>
      </div>

      <div class="w-full text-center -mb-8 absolute bottom-0 pointer-events-none z-10">
        <button class="button button--floating pointer-events-auto" @click="match()">
          assign
        </button>
      </div>
    </div>

    <div class="overflow-auto mt-4 flex z-0" style="height: 8rem; width: calc(100vw - 8rem);">
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
      matchedDjayTracks: [] as TrackInfo[],
      matchedSeratoTracks: [] as TrackInfo[],
    }
  },
  computed: {
    filteredDjayTracks() {
      return this.tracks.filter(t => !this.matchedDjayTracks.includes(t))
    },
    filteredSeratoTracks() {
      return this.seratoTracks.filter(t => !this.matchedSeratoTracks.includes(t))
    },
  },
  methods: {
    selectDjayTrack(track: TrackInfo) {
      this.djayTrack = track
      // TODO sort or filter candidates?
    },
    match() {
      this.matchedDjayTracks.push(this.djayTrack)
      this.matchedSeratoTracks.push(this.seratoTrack)

      this.matches.push({
        ...this.djayTrack,
        ...this.seratoTrack,
        cues: this.djayTrack.cues,
      })

      this.djayTrack = null
      this.seratoTrack = null
    },
  },
})
</script>
