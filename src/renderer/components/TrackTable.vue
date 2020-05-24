<template>
  <div class="flex flex-wrap justify-center">
    <label v-if="searchable">
      <span class="mx-1">Search:</span>
      <input v-model="search" type="text" class="mx-1 my-2 px-2 py-1 form-input text-black bg-background-100">
    </label>
    <table class="table-fixed w-full">
      <thead>
        <tr>
          <th v-if="checkable && tracks.length > 0" class="head--check leading-3">
            <input
              type="checkbox"
              v-model="selectAll"
              class="form-checkbox"
            >
          </th>
          <th
            v-for="col in columns"
            :key="col"
            :class="`head--${col}`"
            class="text-left capitalize whitespace-no-wrap"
          >
            {{ col in headers ? headers[col] : col }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(track, index) in tracks"
          v-show="visible[index]"
          :key="track.path"
          :class="{ 'bg-background-400': track == focus, 'cursor-pointer': focusable || checkable }"
          @click="focusable ? doFocus(track) : (checkable ? toggleCheck(index) : null)"
        >
          <td v-if="checkable" class="text-center cursor-pointer leading-3">
            <input
              type="checkbox"
              v-model="selections[index]"
              class="form-checkbox col--check"
            >
          </td>
          <td
            v-for="col in columns"
            :key="track.path + col"
            :class="`col--${col}`"
            class="w-full"
          >
            {{ col in formatters ? formatters[col](track[col]) : track[col] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
    focus: {
      type: Object as PropType<TrackInfo|null>,
      default: null,
    },
    columns: {
      type: Array as PropType<Array<keyof TrackInfo>>,
      required: true,
    },
    focusable: {
      type: Boolean,
      default: false,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    searchable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const formatTime = x => `${Math.floor(x/60)}:${Math.floor(x%60).toString().padStart(2, '0')}`

    return {
      headers: {
        'cues': 'Cues?',
        'bpm': 'BPM',
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
      selections: this.tracks.map(t => true) as boolean[],
      search: '',
    }
  },
  computed: {
    selectAll: {
      get(): boolean {
        return this.selections.every(t => t)
      },
      set(value: boolean) {
        // only toggle visible tracks
        this.selections = this.tracks.map((t, idx) => this.visible[idx] ? value : this.selections[idx])
      },
    },
    visible() {
      if (this.search == '') {
        return this.tracks.map(t => true)
      } else {
        return this.tracks.map(t => {
          const s = this.search.toLowerCase()
          if (t.artists !== undefined && t.artists.some(a => a.toLowerCase().includes(s))) {
            return true
          }
          if (t.title !== undefined && t.title.toLowerCase().includes(s)) {
            return true
          }
          if (t.album !== undefined && t.album.toLowerCase().includes(s)) {
            return true
          }

          return false
        })
      }
    },
  },
  methods: {
    doFocus(track: TrackInfo) {
      this.$emit('focus', track)
    },
    toggleCheck(index: number) {
      this.$set(this.selections, index, !this.selections[index])
    },
  },
  mounted() {
    // data() selects all by default -> make sure parent is in sync with that
    this.$emit('selections', this.selections)
  },
  watch: {
    tracks() {
      // select all by default
      this.selections = this.tracks.map(t => true)
      this.$emit('selections', this.selections)
    },
    selections() {
      this.$emit('selections', this.tracks.filter((t, idx) => this.selections[idx]))
    },
  },
})
</script>

<style lang="scss" scoped>
td,th {
  @apply px-2;
}

th {
  @apply sticky top-0 bg-background-700 py-1;
}

tbody tr {
  @apply border-b border-background-400;
}

td:nth-child(n+2),th:nth-child(n+2) {
 @apply border-l-2 border-background-400
}

.col--cues, .head--cues,
.col--bpm, .head--bpm,
.col--duration, .head--duration,
.col--songStart, .head--songStart {
  @apply text-center;
}

.col--title {
  @apply break-all;
}

th {
  @apply w-12;
}

.head--check {
  @apply w-6;
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
