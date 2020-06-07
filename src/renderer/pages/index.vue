<template>
  <div class="h-screen flex flex-col items-center px-16 py-6">
    <stepper-header
      :step="step"
      :headings="[
        'Introduction',
        'Load Djay Data',
        'Load Serato Data',
        'Sure Matches',
        'Overwriting Matches',
        'Manual Matches',
        'Process',
        'Done',
      ]"></stepper-header>

    <div class="flex-grow flex flex-col justify-center pt-6">
      <div class="bg-background-600 px-6 py-4 my-auto">
        <step-intro
          v-if="step == 0"
          @next="step++"
        ></step-intro>

        <step-djay
          v-if="step == 1"
          @next="tracks => { djayTracks = tracks; step++ }"
        ></step-djay>

        <step-serato
          v-if="step == 2"
          @next="tracks => { seratoTracks = tracks; step++; match() }">
        </step-serato>

        <step-match-sure
          v-if="step == 3" :tracks="sureMatches"
          @next="tracks => { changesToWrite = changesToWrite.concat(tracks); step++ }">
        </step-match-sure>

        <step-match-overwriting
          v-if="step == 4"
          :tracks="overwritingSureMatches"
          @next="tracks => { changesToWrite = changesToWrite.concat(tracks); step++ }">
        </step-match-overwriting>

        <step-match-manual
          v-if="step == 5"
          :tracks="unsureMatches"
          :serato-tracks="seratoTracks"
          @next="tracks => { changesToWrite = changesToWrite.concat(tracks); step++ }">
        </step-match-manual>

        <step-write
          v-if="step == 6"
          :tracks="changesToWrite"
          @next="step++">
        </step-write>

        <step-done
          v-if="step == 7"
          :tracks="changesToWrite"
          @next="close()">
        </step-done>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as electron from 'electron'
import TrackInfo from '../../../lib/model/TrackInfo'
import { calculateChanges } from '../../../lib/merge'
import StepperHeader from '@/components/StepperHeader.vue'
import StepIntro from '@/components/StepIntro.vue'
import StepDjay from '@/components/StepDjay.vue'
import StepSerato from '@/components/StepSerato.vue'
import StepMatchSure from '@/components/StepMatchSure.vue'
import StepMatchOverwriting from '@/components/StepMatchOverwriting.vue'
import StepMatchManual from '@/components/StepMatchManual.vue'
import StepWrite from '@/components/StepWrite.vue'
import StepDone from '@/components/StepDone.vue'
import { fuzzyTrackInfoEqual, fuzzyTrackInfoCandidate } from '../../../lib/compare'

export default Vue.extend({
  components: {
    StepperHeader,
    StepIntro,
    StepDjay,
    StepSerato,
    StepMatchSure,
    StepMatchOverwriting,
    StepMatchManual,
    StepWrite,
    StepDone,
  },
  data() {
    return {
      step: 0,
      djayTracks: [] as TrackInfo[],
      seratoTracks: [] as TrackInfo[],
      sureMatches: [] as TrackInfo[],
      overwritingSureMatches: [] as TrackInfo[],
      unsureMatches: [] as TrackInfo[],
      changesToWrite: [] as TrackInfo[],
    }
  },
  methods: {
    match() {
      this.djayTracks.forEach((source: TrackInfo) => {
        let anyMatch = false
        this.seratoTracks.forEach((target: TrackInfo) => {
          if (fuzzyTrackInfoEqual(source, target) && fuzzyTrackInfoCandidate(source, target)) {
            anyMatch = true

            const { changes, overwriting } = calculateChanges(source, target)

            if (!overwriting) {
              this.sureMatches.push(changes)
            } else {
              this.overwritingSureMatches.push(changes)
            }
          }
        })
        if (!anyMatch) {
          this.unsureMatches.push(source)
        }
      })
    },
    close() {
      const window = electron.remote.getCurrentWindow()
      window.close()
    },
  },
})
</script>
