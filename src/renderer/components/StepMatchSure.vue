<template>
  <div class="flex flex-col items-center">
    <p>Based on their file tags, these tracks are in both libraries but have no cues or custom beatgrids set in Serato.</p>
    <p>Uncheck tracks you do not want to migrate.</p>
    <div class="overflow-auto mt-4" style="height: calc(100vh - 20rem); width: calc(100vw - 8rem);">
      <track-table
        :tracks="tracks"
        :columns="['artists', 'album', 'title']"
        @selections="ts => selections = ts"
        checkable
        searchable
      ></track-table>
    </div>

    <div class="mt-4">
      <button class="button" @click="$emit('next', selections)">next</button>
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
  },
  data() {
    return {
      selections: [] as TrackInfo[],
    }
  },
})
</script>
