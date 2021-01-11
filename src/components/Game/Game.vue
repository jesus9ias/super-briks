<template>
  <div class="game">
   Game
   <scenario />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Scenario from './Scenario.vue';

@Options({
  components: {
    Scenario,
  },
})
export default class Game extends Vue {
}
</script>

<style scoped lang="scss">
</style>
