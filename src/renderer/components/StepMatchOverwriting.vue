<template>
  <div class="flex flex-col items-center">
    <p>These Djay tracks can be migrated, but Serato cues exist and will be overwritten.</p>
    <p>Uncheck tracks you do not want to migrate.</p>
    <div class="overflow-auto mt-4" style="height: calc(100vh - 20rem); width: calc(100vw - 8rem);">
      <track-table
        :tracks="tracks"
        :columns="['artists', 'album', 'title']"
        @selections="ts => selections = ts"
        checkable
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
