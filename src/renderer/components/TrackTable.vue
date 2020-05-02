<template>
  <table>
    <thead>
      <tr>
        <th class="text-left capitalize" v-for="col in columns" :key="col">{{ col }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="track in value"
        :key="track.path"
        :class="{ 'bg-background-400': track.selected }"
        class="cursor-pointer"
        @click="$set(track, 'selected', !track.selected)"
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
    value: {
      type: Array as PropType<TrackInfo[]>,
      required: true,
    },
  },
  data() {
    const id = x => x
    return {
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

      if(this.value.some(t => t.artists !== undefined)) {
        cols.push('artists')
      }
      if(this.value.some(t => t.title !== undefined)) {
        cols.push('title')
      }
      if(this.value.some(t => t.filename !== undefined)) {
        cols.push('filename')
      }
      if(this.value.some(t => t.cues !== undefined)) {
        cols.push('cues')
      }

      return cols
    },
  },
})
</script>
