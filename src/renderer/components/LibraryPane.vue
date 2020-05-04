<template>
  <div class="flex flex-col">
    <h2 class="text-lg font-medium text-primary-500">{{ name }} Library</h2>
    <div class="mt-2 flex-grow overflow-y-auto">
      <track-table
        v-model="value"
        :columns="library.attributes()"
        :selection="selection"
        :default-columns="['title', 'artists', 'cues']"
        @select="t => $emit('select', t)"
        selectable
      ></track-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TrackTable from '@/components/TrackTable.vue'
import TrackInfo from '../../../lib/model/TrackInfo'
import LibraryManager from '../../../lib/model/LibraryManager'

export default Vue.extend({
  components: {
    TrackTable,
  },
  props: {
    value: {
      type: Array as PropType<TrackInfo[]>,
      required: true,
    },
    selection: {
      type: Object as PropType<TrackInfo|null>,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    library: {
      type: Object as PropType<LibraryManager>,
      required: true,
    },
  },
  async created() {
    await this.library.load()
    this.$emit('input', this.library.list())
  },
})
</script>
