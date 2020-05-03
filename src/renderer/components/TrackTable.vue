<template>
  <table>
    <thead>
      <tr>
        <th class="text-left capitalize" v-for="col in columns" :key="col">{{ col }}</th>
        <th v-if="deletable"></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="track in value"
        :key="track.path"
        :class="{ 'bg-background-400': track == selection }"
        class="cursor-pointer"
        @click="select(track)"
      >
        <td v-for="col in columns" :key="track.path + col">{{ formatters[col](track[col]) }}</td>
        <td v-if="deletable" @click="remove(track)">
          <i class="fas fa-trash"></i>
        </td>
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
    selection: {
      type: Object as PropType<TrackInfo|null>,
      default: null,
    },
    deletable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const id = x => x
    return {
      formatters: {
        'title': id,
        'artists': x => x == undefined ? '' : x.join(', '),
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
  methods: {
    select(track: TrackInfo) {
      this.$emit('select', track)
    },
    remove(track: TrackInfo) {
      this.$emit('input', this.value.filter(t => t !== track))
    },
  },
})
</script>
