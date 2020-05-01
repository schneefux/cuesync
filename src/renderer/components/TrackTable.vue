<template>
  <table>
    <thead>
      <tr>
        <th class="text-left">Artist</th>
        <th class="text-left">Title</th>
        <th class="text-left">File</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="track in value" :key="track.path">
        <td>{{ [track.artists||[]].join(', ')}}</td>
        <td>{{ track.title }}</td>
        <td>{{ track.filename }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue'
import TrackInfo from '../../../lib/model/TrackInfo'

export default Vue.extend({
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
})
</script>
