<template>
  <table>
    <thead>
      <tr>
        <th class="text-left capitalize" v-for="col in columns" :key="col">{{ col }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="track in tracks"
        :key="track.path"
        :class="{ 'bg-background-400': track == selection }"
        class="cursor-pointer"
        @click="select(track)"
      >
        <td v-for="col in columns" :key="track.path + col">{{ formatters[col](track[col]) }}</td>
      </tr>
    </tbody>
  </table>
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
  data() {
    const id = x => x
    return {
      selection: undefined as TrackInfo,
      formatters: {
        'title': id,
        'artists': x => x.join(', '),
        'filename': id,
        'cues': x => x == undefined ? '' : x.length > 0 ? '✔️' : '❌'
      }
    }
  },
  computed: {
    columns() {
      const cols = [] as string[]

      if(this.tracks.some(t => t.artists !== undefined)) {
        cols.push('artists')
      }
      if(this.tracks.some(t => t.title !== undefined)) {
        cols.push('title')
      }
      if(this.tracks.some(t => t.filename !== undefined)) {
        cols.push('filename')
      }
      if(this.tracks.some(t => t.cues !== undefined)) {
        cols.push('cues')
      }

      return cols
    },
  },
  methods: {
    select(track: TrackInfo) {
      this.selection = track
      this.$emit('select', track)
    }
  },
})
</script>
