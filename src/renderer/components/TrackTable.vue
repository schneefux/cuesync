<template>
  <table class="table-fixed w-full">
    <thead>
      <tr>
        <th
          v-for="col in visibleColumns"
          :key="col"
          :class="`head--${col}`"
          class="text-left capitalize whitespace-no-wrap"
        >
          {{ col in headers ? headers[col] : col }}
        </th>
        <th v-if="deletable" v-show="value.length > 0">Remove</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="track in value"
        :key="track.path"
        :class="{ 'bg-background-400': track == selection, 'cursor-pointer': selectable }"
        @click="selectable ? select(track) : null"
      >
        <td
          v-for="col in visibleColumns"
          :key="track.path + col"
          :class="`col--${col}`"
          class="w-full"
        >
          {{ col in formatters ? formatters[col](track[col]) : track[col] }}
        </td>
        <td v-if="deletable" @click="remove(track)" class="text-center cursor-pointer">
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
    columns: {
      type: Array as PropType<Array<keyof TrackInfo>>,
      required: true,
    },
    defaultColumns: {
      type: Array as PropType<Array<keyof TrackInfo>>,
      default() {
        return this.columns
      },
    },
    deletable: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const formatTime = x => `${Math.floor(x/60)}:${Math.floor(x%60).toString().padStart(2, '0')}`

    return {
      headers: {
        'cues': 'Cues?',
        'bpm': 'BPM?',
        'bpmLock': 'BPM Locked?',
        'durationSeconds': 'duration',
        'isrc': 'ISRC',
        'songStart': 'Song Start',
      },
      formatters: {
        'artists': x => x == undefined ? '' : x.join(', '),
        'cues': x => x == undefined ? '' : x.length > 0 ? '✔️' : '❌',
        'bpmLock': x => x == undefined ? '' : x == 'true' ? '✔️' : '❌',
        'bpm': x => x == undefined ? '' : Math.floor(x),
        'durationSeconds': x => x == undefined ? '' : formatTime(x),
        'songStart': x => x == undefined ? '' : formatTime(x),
      },
      visibleColumns: this.defaultColumns.filter(c => this.columns.includes(c)),
    }
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

<style lang="scss" scoped>
td,th {
  @apply px-2;
}

.col--cues, .head--cues,
.col--bpm, .head--bpm,
.col--duration, .head--duration {
  @apply text-center;
}

th {
  @apply w-12;
}

.head--title {
  @apply w-2/12;
}

.head--album {
  @apply w-2/12;
}

.head--artists {
  @apply w-2/12;
}
</style>
