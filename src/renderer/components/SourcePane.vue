<template>
  <div>
    <button @click="load" class="button">Reload Djay</button>
    <input type="text" v-model="search" class="ml-2 textinput">
    <ul class="mt-2">
      <li>
        {{ trackInfo }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as path from 'path'
import * as os from 'os'
import DjayLibraryManager from '@/../../lib/djay/DjayLibraryManager'
import TrackInfo from '../../../lib/model/TrackInfo'

export default Vue.extend({
  data() {
    const djayLibraryPath = path.join(os.homedir(), '\\AppData\\Local\\Packages\\59BEBC1A.djayPro_e3tqh12mt5rj6\\LocalState\\Library\\Algoriddim\\djay Preset Library.plist')
    const djayLibrary = new DjayLibraryManager(djayLibraryPath)
    return {
      djayLibrary,
      search: '',
      trackInfo: {} as TrackInfo|null,
    }
  },
  async created() {
    await this.djayLibrary.load()
  },
  methods: {
    async load() {
      await this.djayLibrary.load()
    },
  },
  watch: {
    async search() {
      this.trackInfo = await this.djayLibrary.find({ title: this.search })
    },
  },
})
</script>

<style lang="scss" scoped>
.button {
  @apply border-2 border-secondary-500 bg-background-900 rounded-sm px-2 py-1;
}

.textinput {
  @apply bg-background-400 rounded-sm px-2 py-1;
}
</style>
