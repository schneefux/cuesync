<template>
  <div>
    <button @click="load" class="button">Reload Serato</button>
    <input type="text" v-model="search" class="ml-2 textinput">
    <div class="mt-2 overflow-y-auto h-70vh">
      <track-table :value="tracks"></track-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as path from 'path'
import * as os from 'os'
import TrackInfo from '../../../lib/model/TrackInfo'
import TrackTable from '@/components/TrackTable.vue'
import SeratoLibraryManager from '../../../lib/serato/SeratoLibraryManager'

export default Vue.extend({
  components: {
    TrackTable,
  },
  data() {
    const seratoCratePath = 'M:\\'
    const seratoLibrary = new SeratoLibraryManager(seratoCratePath)
    return {
      seratoLibrary,
      search: '',
      trackInfo: {} as TrackInfo|null,
      tracks: [] as TrackInfo[],
    }
  },
  async created() {
    await this.load()
  },
  methods: {
    async load() {
      await this.seratoLibrary.load()
      this.tracks = this.seratoLibrary.list()
    },
  },
  watch: {
    async search() {
      this.trackInfo = await this.seratoLibrary.find({ title: this.search })
    },
  },
})
</script>

<style lang="scss" scoped>
</style>
