<template>
  <div class="flex flex-col items-center">
    <p>You are about to migrate {{ tracks.length }} tracks.</p>
    <p>This is a trial version so you can select up to 5 tracks.</p>
    <p>Or purchase a license key and enter it here:</p>
    <input v-model="key" type="text" class="mx-1 my-2 px-2 py-1 form-input text-black bg-background-100">
    <button class="button" @click="activateKey()">activate</button>
    <div class="overflow-auto mt-4" style="height: calc(100vh - 26rem); width: calc(100vw - 8rem);">
      <track-table
        :tracks="tracks"
        :columns="['artists', 'album', 'title']"
        @selections="ts => selections = ts"
        checkable
        searchable
      ></track-table>
    </div>

    <div class="mt-4">
      <button class="button" :disabled="trial && selections.length > 5" @click="$emit('next', selections)">next</button>
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
  async created() {
    await this.checkLicense()
  },
  data() {
    return {
      selections: [] as TrackInfo[],
      trial: true,
      key: '',
    }
  },
  methods: {
    async checkLicense() {
      const license = localStorage.getItem('license') || ''
      // TODO implement license check according to https://payhip.com/support/software-license-keys/
      if (license !== '') {
        this.trial = false
        this.$emit('next', this.tracks)
      }
    },
    async activateKey() {
      localStorage.setItem('license', this.key)
      await this.checkLicense()
    },
  },
})
</script>
