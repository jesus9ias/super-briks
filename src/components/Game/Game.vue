<template>
  <div class="game">
   Game
   <scenario />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Scenario from './Scenario.vue';
import Timer from './Timer';

@Options({
  components: {
    Scenario,
  },
})
export default class Game extends Vue {
  private timer = new Timer();

  created() {
    this.timer.startGame();
  }
}
</script>

<style scoped lang="scss">
</style>
