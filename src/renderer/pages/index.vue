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
          @next="tracks => { tracksToWrite = tracksToWrite.concat(tracks); step++ }">
        </step-match-sure>

        <step-match-overwriting
          v-if="step == 4"
          :tracks="overwritingSureMatches"
          @next="tracks => { tracksToWrite = tracksToWrite.concat(tracks); step++ }">
        </step-match-overwriting>

        <step-match-manual
          v-if="step == 5"
          :tracks="unsureMatches"
          :serato-tracks="seratoTracks"
          @next="tracks => { tracksToWrite = tracksToWrite.concat(tracks); step++ }">
        </step-match-manual>

        <step-write
          v-if="step == 6"
          :tracks="tracksToWrite"
          @next="step++">
        </step-write>

        <step-done
          v-if="step == 7"
          :tracks="tracksToWrite">
        </step-done>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TrackInfo from '../../../lib/model/TrackInfo'
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
      tracksToWrite: [] as TrackInfo[],
    }
  },
  methods: {
    match() {
      this.djayTracks.forEach(source => {
        let anyMatch = false
        this.seratoTracks.forEach(target => {
          if (fuzzyTrackInfoEqual(source, target)) {
            const t = {
              ...source,
              ...target,
              cues: source.cues,
            }

            if (fuzzyTrackInfoCandidate(source, target)) {
              anyMatch = true
              if (target.cues.length == 0) {
                this.sureMatches.push(t)
              } else {
                this.overwritingSureMatches.push(t)
              }
            }
          }
        })
        if (!anyMatch) {
          this.unsureMatches.push(source)
        }
      })
    },
  },
})
</script>
