<template>
  <div class="max-w-md h-20 bg-background-600 stepper">
    <div
      v-for="s in headings.length"
      :key="s"
      class="stepper__step"
      :class="{ 'stepper__step--complete': s - 1 < step, 'stepper__step--active': s - 1 == step }"
    ></div>
    <h1 class="stepper__title">
      {{ step + 1 }}. {{ headings[step] }}
    </h1>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    headings: {
      type: Array as PropType<string[]>,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
  }
})
</script>

<style lang="scss" scoped>
.stepper {
  @apply flex flex-wrap justify-center;

  &__step {
    @apply h-6 w-6 my-3 mx-3 rounded-full bg-background-400;

    &--active {
      @apply bg-primary-400;
    }

    &--complete {
      @apply bg-primary-700;
    }
  }

  &__title {
    @apply w-full text-center tracking-wide text-lg mb-2;
  }
}
</style>
