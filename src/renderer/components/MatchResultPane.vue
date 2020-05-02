<template>
  <div class="flex">
    <div class="w-5/6 flex flex-col">
      <h2 class="text-lg font-medium text-primary-500">Data to migrate from {{ sourceName }} to {{ targetName }}</h2>
      <div class="mt-2 flex-grow overflow-y-auto">
        <track-table :value="value" @input="v => $emit('input', v)" deletable></track-table>
      </div>
    </div>

    <div class="w-1/6 flex items-center justify-center">
      <button class="button text-xl font-semibold tracking-wide">Sync</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import * as path from 'path'
import * as os from 'os'
import DjayLibraryManager from '@/../../lib/djay/DjayLibraryManager'
import TrackInfo from '../../../lib/model/TrackInfo'
import TrackTable from '@/components/TrackTable.vue'

export default Vue.extend({
  props: {
    value: {
      type: Array as PropType<TrackInfo[]>,
      required: true,
    },
    sourceName: {
      type: String,
      required: true,
    },
    targetName: {
      type: String,
      required: true,
    },
  },
  components: {
    TrackTable,
  },
})
</script>
